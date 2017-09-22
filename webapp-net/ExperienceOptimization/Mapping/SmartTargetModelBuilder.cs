using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DD4T.ContentModel;
using Sdl.Web.Common;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.DataModel;
using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Tridion.ContentManager;
using Sdl.Web.Tridion.Mapping;
using Tridion.ContentDelivery.AmbientData;
using Tridion.SmartTarget.Analytics;
using Tridion.SmartTarget.Query;
using Tridion.SmartTarget.Query.Builder;
using Tridion.SmartTarget.Utils;
using IPage = DD4T.ContentModel.IPage;
using MvcData = Sdl.Web.Common.Models.MvcData;
using TcmUri = Tridion.SmartTarget.Utils.TcmUri;
using System.Globalization;

namespace Sdl.Web.Modules.SmartTarget.Mapping
{
    /// <summary>
    /// SmartTarget Model Builder.
    /// </summary>
    /// <remarks>
    /// This Model Builder should be configured in the modelBuilderPipeline section in Web.config to run after the <see cref="DefaultModelBuilder"/>.
    /// It can act both as Legacy Model Builder (<see cref="IModelBuilder"/>) and as R2 Model Builder (<see cref="IPageModelBuilder"/>).
    /// </remarks>
    public class SmartTargetModelBuilder : IModelBuilder, IPageModelBuilder
    {
        private const string PromotionViewNameConfig = "smarttarget.smartTargetEntityPromotion";
        private const string AllowDuplicatesFieldName = "allowDuplicationOnSamePage";
        private const string UseConfigValue = "Use core configuration";

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
                if ((pageModel == null) || !pageModel.Regions.OfType<SmartTargetRegion>().Any())
                {
                    Log.Debug("No SmartTarget Regions on Page.");
                    return;
                }

                if ((page?.PageTemplate?.MetadataFields == null) || !page.PageTemplate.MetadataFields.ContainsKey("regions"))
                {
                    Log.Debug("No Regions metadata found.");
                    return;
                }

                // "Upgrade" the PageModel to a SmartTargetPageModel, so we can store AllowDuplicates in the Page Model.
                SmartTargetPageModel smartTargetPageModel = new SmartTargetPageModel(pageModel)
                {
                    AllowDuplicates = GetAllowDuplicatesOnSamePage(page.PageTemplate, localization),
                    NoCache = true // Don't cache the Page Model, because its contents are dynamic.
                };
                pageModel = smartTargetPageModel;

                // Set SmartTargetRegionModel.MaxItem based on the Region Metadata in the Page Template.
                foreach (IFieldSet smartTargetRegionField in page.PageTemplate.MetadataFields["regions"].EmbeddedValues)
                {
                    string regionName;
                    IField regionNameField;
                    if (smartTargetRegionField.TryGetValue("name", out regionNameField) && !string.IsNullOrEmpty(regionNameField.Value))
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
                        int maxItems = 100; // Default
                        IField maxItemsField;
                        if (smartTargetRegionField.TryGetValue("maxItems", out maxItemsField))
                        {
                            maxItems = Convert.ToInt32(maxItemsField.NumericValues[0]);
                        }
                        smartTargetRegion.MaxItems = maxItems;
                    }
                }

                PopulateSmartTargetRegions(smartTargetPageModel, localization);
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

        #region IPageModelBuilder members
        /// <summary>
        /// Builds a strongly typed Page Model from a given DXA R2 Data Model.
        /// </summary>
        /// <param name="pageModel">The strongly typed Page Model to build. Is <c>null</c> for the first Page Model Builder in the pipeline.</param>
        /// <param name="pageModelData">The DXA R2 Data Model.</param>
        /// <param name="includePageRegions">Indicates whether Include Page Regions should be included.</param>
        /// <param name="localization">The context <see cref="Localization"/>.</param>
        public void BuildPageModel(ref PageModel pageModel, PageModelData pageModelData, bool includePageRegions, Localization localization)
        {
            using (new Tracer(pageModel, pageModelData, includePageRegions, localization))
            {
                if ((pageModel == null) || !pageModel.Regions.OfType<SmartTargetRegion>().Any())
                {
                    Log.Debug("No SmartTarget Regions on Page.");
                    return;
                }

                // "Upgrade" the PageModel to a SmartTargetPageModel, so we can store AllowDuplicates in the Page Model.
                SmartTargetPageModel smartTargetPageModel = new SmartTargetPageModel(pageModel)
                {
                    AllowDuplicates = GetAllowDuplicatesOnSamePage(pageModelData, localization),
                    NoCache = true // Don't cache the Page Model, because its contents are dynamic.
                };
                pageModel = smartTargetPageModel;

                // Set SmartTargetRegionModel.MaxItem based on the Region Metadata
                foreach (SmartTargetRegion smartTargetRegion in pageModel.Regions.OfType<SmartTargetRegion>())
                {
                    string regionName = smartTargetRegion.Name;
                    RegionModelData regionModelData = pageModelData.Regions.First(r => r.Name == regionName);

                    int maxItems = 100; // Default
                    if ((regionModelData.Metadata != null) && regionModelData.Metadata.ContainsKey("maxItems"))
                    {
                        maxItems = GetInt(regionModelData.Metadata["maxItems"]);
                    }
                    smartTargetRegion.MaxItems = maxItems;
                }

                PopulateSmartTargetRegions(smartTargetPageModel, localization);
            }
        }
        #endregion

        private void PopulateSmartTargetRegions(SmartTargetPageModel smartTargetPageModel, Localization localization)
        {
            // Execute a ST Query for all SmartTargetRegions on the Page.
            ResultSet resultSet = ExecuteSmartTargetQuery(smartTargetPageModel, localization);
            Log.Debug($"SmartTarget query returned {resultSet.Promotions.Count} Promotions.");

            string promotionViewName = localization.GetConfigValue(PromotionViewNameConfig);
            if (String.IsNullOrEmpty(promotionViewName))
            {
                Log.Warn($"No View name for SmartTarget Promotions is configured on CM-side ({PromotionViewNameConfig})");
                promotionViewName = "SmartTarget:Entity:Promotion";
            }
            Log.Debug($"Using Promotion View '{promotionViewName}'");

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

                if (experimentDimensions != null)
                {
                    // The SmartTarget API doesn't set all ExperimentDimensions properties, but they are required by the ExperimentTrackingHandler (see CRQ-1667).
                    experimentDimensions.PublicationId = localization.GetCmUri();
                    experimentDimensions.PageId = localization.GetCmUri(smartTargetPageModel.Id, (int) ItemType.Page);
                    experimentDimensions.Region = smartTargetRegion.Name;
                }

                if (localization.IsXpmEnabled)
                {
                    // The SmartTarget API provides the entire XPM markup tag; put it in XpmMetadata["Query"]. See SmartTargetRegion.GetStartQueryXpmMarkup.
                    smartTargetRegion.XpmMetadata = new Dictionary<string, object>
                        {
                            {"Query", ResultSet.GetExperienceManagerMarkup(smartTargetRegion.Name, smartTargetRegion.MaxItems, promotions)}
                        };
                }

                // Create SmartTargetPromotion Entity Models for visible Promotions in the current SmartTargetRegion.
                // It seems that ResultSet.FilterPromotions doesn't really filter on Region name, so we do post-filtering here.
                foreach (Promotion promotion in promotions.Where(promotion => promotion.Visible && promotion.Regions.Contains(regionName)))
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

        protected virtual SmartTargetPromotion CreatePromotionEntity(Promotion promotion, string viewName, string regionName, Localization localization, ExperimentDimensions experimentDimensions)
        {
            // In ST 2014 SP1 the ResultSet.FilterPromotions API represents Experiments as type Promotion, so we're not testing on type Experiment here.
            SmartTargetPromotion result = (experimentDimensions != null) ? new SmartTargetExperiment(experimentDimensions) : new SmartTargetPromotion();

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
            string entityId = $"{item.ComponentUri.ItemId}-{item.TemplateUri.ItemId}";
            return new SmartTargetItem(entityId, localization);
        }

        private static ResultSet ExecuteSmartTargetQuery(SmartTargetPageModel smartTargetPageModel, Localization localization)
        {
            using (new Tracer(smartTargetPageModel, localization))
            {
                TcmUri pageUri = new TcmUri(localization.GetCmUri(smartTargetPageModel.Id, (int) ItemType.Page));
                TcmUri publicationUri = new TcmUri(localization.GetCmUri());

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

        private static bool GetAllowDuplicatesFromConfig(Localization localization)
        {
            string configValue = localization.GetConfigValue("smarttarget.allowDuplicationOnSamePageConfig");
            return Convert.ToBoolean(configValue);
        }

        /// <summary>
        /// Determines whether duplicate ST Items are allowed on this page.
        /// </summary>
        /// <remarks>
        /// Used in R2 Model Builder Pipeline.
        /// </remarks>
        private static bool GetAllowDuplicatesOnSamePage(PageModelData pageModelData, Localization localization)
        {
            object allowDups;
            if ((pageModelData.Metadata == null) || !pageModelData.Metadata.TryGetValue(AllowDuplicatesFieldName, out allowDups))
            {
                Log.Warn($"Metadata field '{AllowDuplicatesFieldName}' not found in Page Model '{pageModelData.Id}' Data.");
                return false;
            }
            string allowDuplicates = allowDups as string;

            if (string.IsNullOrEmpty(allowDuplicates) || allowDuplicates.Equals(UseConfigValue, StringComparison.OrdinalIgnoreCase))
            {
                return GetAllowDuplicatesFromConfig(localization);
            }

            return Convert.ToBoolean(allowDuplicates);
        }

        /// <summary>
        /// Determines whether duplicate ST Items are allowed on this page.
        /// </summary>
        /// <remarks>
        /// Used in Legacy Model Builder Pipeline (DD4T-based)
        /// </remarks>
        private static bool GetAllowDuplicatesOnSamePage(IPageTemplate pageTemplate, Localization localization)
        {
            string allowDuplicates = null;
            if ((pageTemplate?.MetadataFields != null) && pageTemplate.MetadataFields.ContainsKey(AllowDuplicatesFieldName))
            {
                allowDuplicates = pageTemplate.MetadataFields[AllowDuplicatesFieldName].Value;
            }

            if (string.IsNullOrEmpty(allowDuplicates) || allowDuplicates.Equals(UseConfigValue, StringComparison.OrdinalIgnoreCase))
            {
                return GetAllowDuplicatesFromConfig(localization);
            }

            return Convert.ToBoolean(allowDuplicates);
        }

        private static int GetInt(object value)
        {       
            if (value is string && ((string)value).Contains("."))
            {
                return (int)(double)Convert.ChangeType(value, typeof(double), CultureInfo.InvariantCulture.NumberFormat);
            }
            return Convert.ToInt32(value);
        }
    }
}
