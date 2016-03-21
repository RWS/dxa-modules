using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DD4T.ContentModel;
using Sdl.Web.Common;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Tridion.Mapping;
using Tridion.ContentDelivery.AmbientData;
using Tridion.SmartTarget.Analytics;
using Tridion.SmartTarget.Query;
using Tridion.SmartTarget.Query.Builder;
using Tridion.SmartTarget.Utils;
using IPage = DD4T.ContentModel.IPage;
using TcmUri = Tridion.SmartTarget.Utils.TcmUri;

namespace Sdl.Web.Modules.SmartTarget.Mapping
{
    /// <summary>
    /// SmartTarget Model Builder.
    /// </summary>
    /// <remarks>
    /// This Model Builder should be configured in the modelBuilderPipeline section in Web.config to run after the <see cref="DefaultModelBuilder"/>.
    /// </remarks>
    public class SmartTargetModelBuilder : IModelBuilder
    {
        private const string PromotionViewNameConfig = "smarttarget.smartTargetEntityPromotion";

        #region IModelBuilder members
        /// <summary>
        /// Post-processes the Page Model constructed by the <see cref="DefaultModelBuilder"/>.
        /// </summary>
        /// <remarks>
        /// This implementation relies on the <see cref="DefaultModelBuilder"/> already having constructed Region Models of type <see cref="SmartTargetRegion"/>.
        /// We "upgrade" the Page Model to type <see cref="SmartTargetPageModel"/> and populate the ST Regions <see cref="SmartTargetPromotion"/> Entities.
        /// </remarks>
        public void BuildPageModel(ref PageModel pageModel, IPage page, IEnumerable<IPage> includes, Localization localization)
        {
            using (new Tracer(pageModel, page, includes, localization))
            {
                if (pageModel == null || !pageModel.Regions.OfType<SmartTargetRegion>().Any())
                {
                    Log.Debug("No SmartTarget Regions on Page.");
                    return;
                }
                
                if (page == null || page.PageTemplate == null || page.PageTemplate.MetadataFields == null || !page.PageTemplate.MetadataFields.ContainsKey("regions"))
                {
                    Log.Debug("No Regions metadata found.");
                    return;
                }

                // "Upgrade" the PageModel to a SmartTargetPageModel, so we can store AllowDuplicates in the Page Model.
                SmartTargetPageModel smartTargetPageModel = new SmartTargetPageModel(pageModel)
                {
                    AllowDuplicates = GetAllowDuplicatesOnSamePage(page.PageTemplate, localization)
                };
                pageModel = smartTargetPageModel;
                
                // Set SmartTargetRegionModel.MaxItem based on the Region Metadata in the Page Template.
                foreach (IFieldSet smartTargetRegionField in page.PageTemplate.MetadataFields["regions"].EmbeddedValues)
                {
                    string regionName;
                    IField regionNameField;
                    if (smartTargetRegionField.TryGetValue("name", out regionNameField) && !String.IsNullOrEmpty(regionNameField.Value))
                    {
                        regionName = regionNameField.Value;
                    }
                    else
                    {
                        regionName = new MvcData(smartTargetRegionField["view"].Value).ViewName;
                    }

                    SmartTargetRegion smartTargetRegion = smartTargetPageModel.Regions[regionName] as SmartTargetRegion;
                    if (smartTargetRegion != null)
                    {
                        int maxItems = smartTargetRegionField.ContainsKey("maxItems") ? Convert.ToInt32(smartTargetRegionField["maxItems"].Value) : 100;
                        smartTargetRegion.MaxItems = maxItems;
                    }
                }

                // Execute a ST Query for all SmartTargetRegions on the Page.
                ResultSet resultSet = ExecuteSmartTargetQuery(smartTargetPageModel, localization);
                Log.Debug("SmartTarget query returned {0} Promotions.", resultSet.Promotions.Count);

                string promotionViewName = localization.GetConfigValue(PromotionViewNameConfig);
                if (String.IsNullOrEmpty(promotionViewName))
                {
                    Log.Warn("No View name for SmartTarget Promotions is configured on CM-side ({0})", PromotionViewNameConfig);
                    promotionViewName = "SmartTarget:Entity:Promotion";
                }
                Log.Debug("Using Promotion View '{0}'", promotionViewName);

                // TODO: we shouldn't access HttpContext in a Model Builder.
                HttpContext httpContext = HttpContext.Current;
                if (httpContext == null)
                {
                    throw new DxaException("HttpContext is not available.");
                }

                List<string> itemsAlreadyOnPage = new List<string>();
                ExperimentCookies existingExperimentCookies = CookieProcessor.GetExperimentCookies(httpContext.Request); 
                ExperimentCookies newExperimentCookies = new ExperimentCookies();

                // Filter the Promotions for each SmartTargetRegion
                foreach (SmartTargetRegion smartTargetRegion in smartTargetPageModel.Regions.OfType<SmartTargetRegion>())
                {
                    string regionName = smartTargetRegion.Name;

                    List<string> itemsOutputInRegion = new List<string>();
                    ExperimentDimensions experimentDimensions;
                    List<Promotion> promotions = new List<Promotion>(resultSet.Promotions);
                    ResultSet.FilterPromotions(promotions, regionName, smartTargetRegion.MaxItems, smartTargetPageModel.AllowDuplicates, itemsOutputInRegion,
                            itemsAlreadyOnPage, ref existingExperimentCookies, ref newExperimentCookies,
                            out experimentDimensions);

                    if (localization.IsStaging)
                    {
                        // The SmartTarget API provides the entire XPM markup tag; put it in XpmMetadata["Query"]. See SmartTargetRegion.GetStartQueryXpmMarkup.
                        smartTargetRegion.XpmMetadata = new Dictionary<string, object>
                        {
                            {"Query", ResultSet.GetExperienceManagerMarkup(smartTargetRegion.Name, smartTargetRegion.MaxItems, promotions)}
                        };
                    }

                    // Create SmartTargetPromotion Entity Models for visible Promotions in the current SmartTargetRegion.
                    // It seems that ResultSet.FilterPromotions doesn't really filter on Region name, so we do post-filtering here.
                    foreach (Promotion promotion in promotions.Where(promotion => promotion.Visible && promotion.Region.Contains(regionName)))
                    {
                        SmartTargetPromotion smartTargetPromotion = CreatePromotionEntity(promotion, promotionViewName, smartTargetRegion.Name, localization, experimentDimensions);

                        if (!smartTargetRegion.HasSmartTargetContent)
                        {
                            // Discard any fallback content coming from Content Manager
                            smartTargetRegion.Entities.Clear();
                            smartTargetRegion.HasSmartTargetContent = true;
                        }

                        smartTargetRegion.Entities.Add(smartTargetPromotion);
                    }
                }

                if (newExperimentCookies.Count > 0)
                {
                    smartTargetPageModel.ExperimentCookies = newExperimentCookies;
                }
            }
        }
        
        public void BuildEntityModel(ref EntityModel entityModel, IComponentPresentation cp, Localization localization)
        {
            // No post-processing of Entity Models needed
        }

        public void BuildEntityModel(ref EntityModel entityModel, IComponent component, Type baseModelType, Localization localization)
        {
            // No post-processing of Entity Models needed
        }
        #endregion

        protected virtual SmartTargetPromotion CreatePromotionEntity(Promotion promotion, string viewName, string regionName, Localization localization, ExperimentDimensions experimentDimensions)
        {
            SmartTargetPromotion result = (promotion is Experiment) ? new SmartTargetExperiment(experimentDimensions) : new SmartTargetPromotion();

            result.MvcData = new MvcData(viewName);
            result.XpmMetadata = new Dictionary<string, object>
            {
                {"PromotionID", promotion.PromotionId},
                {"RegionID", regionName}
            };
            result.Title = promotion.Title;
            result.Slogan = promotion.Slogan;
            // Create SmartTargetItem objects for visible ST Items.
            result.Items = promotion.Items.Where(item => item.Visible).Select(item => CreateSmartTargetItem(item, localization)).ToList();

            return result;
        }

        protected virtual SmartTargetItem CreateSmartTargetItem(Item item, Localization localization)
        {
            string entityId = String.Format("{0}-{1}", item.ComponentUri.ItemId, item.TemplateUri.ItemId);
            return new SmartTargetItem(entityId, localization);
        }

        private static ResultSet ExecuteSmartTargetQuery(SmartTargetPageModel smartTargetPageModel, Localization localization)
        {
            using (new Tracer(smartTargetPageModel, localization))
            {
                TcmUri pageUri = new TcmUri(String.Format("tcm:{0}-{1}-64", localization.LocalizationId, smartTargetPageModel.Id));
                TcmUri publicationUri = new TcmUri(0, pageUri.PublicationId, 1);

                ClaimStore claimStore = AmbientDataContext.CurrentClaimStore;
                string triggers = AmbientDataHelper.GetTriggers(claimStore);

                QueryBuilder queryBuilder = new QueryBuilder();
                queryBuilder.Parse(triggers);
                queryBuilder.AddCriteria(new PublicationCriteria(publicationUri));
                queryBuilder.AddCriteria(new PageCriteria(pageUri));

                // Adding all the page regions to the query for having only 1 query a page
                foreach (SmartTargetRegion region in smartTargetPageModel.Regions.OfType<SmartTargetRegion>())
                {
                    queryBuilder.AddCriteria(new RegionCriteria(region.Name));
                }

                return queryBuilder.Execute();
            }
        }


        /// <summary>
        /// Determines whether duplicate ST Items are allowed on this page.
        /// </summary>
        private static bool GetAllowDuplicatesOnSamePage(IPageTemplate pageTemplate, Localization localization)
        {
            const string allowDuplicatesFieldName = "allowDuplicationOnSamePage";
            const string allowDuplicatesConfig = "smarttarget.allowDuplicationOnSamePageConfig";

            string allowDuplicates = null;
            if (pageTemplate != null && pageTemplate.MetadataFields != null && pageTemplate.MetadataFields.ContainsKey(allowDuplicatesFieldName))
            {
                allowDuplicates = pageTemplate.MetadataFields[allowDuplicatesFieldName].Value;
            }

            if (String.IsNullOrEmpty(allowDuplicates) || allowDuplicates.Equals("Use core configuration", StringComparison.OrdinalIgnoreCase))
            {
                allowDuplicates = localization.GetConfigValue(allowDuplicatesConfig);
                if (String.IsNullOrEmpty(allowDuplicates))
                {
                    allowDuplicates = "true";
                }
            }

            return Convert.ToBoolean(allowDuplicates);
        }
    }
}
