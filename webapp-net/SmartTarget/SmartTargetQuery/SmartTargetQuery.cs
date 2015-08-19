using System.Collections.Generic;
using Sdl.Web.Modules.SmartTarget.Models;
using Tridion.ContentDelivery.AmbientData;
using Tridion.SmartTarget.Query;
using Tridion.SmartTarget.Query.Builder;
using Tridion.SmartTarget.Utils;
using Sdl.Web.Common.Configuration;
using System.Linq;
using System.Web;
using Sdl.Web.Common;
using Sdl.Web.Common.Models;
using Tridion.SmartTarget.Analytics;
using TcmUri = Tridion.SmartTarget.Utils.TcmUri;
using System;
using Sdl.Web.Modules.SmartTarget.Utils;

namespace Sdl.Web.Modules.SmartTarget.SmartTargetQuery
{
    public class SmartTargetQuery
    {
        /// <summary>
        /// Set all page regions with SmartTarget content if available.
        /// </summary>
        /// <param name="smartTargetPageModel"></param>
        /// <param name="localization"></param>
        public static void SetPageRegionEntities(SmartTargetPageModel smartTargetPageModel, Localization localization)
        {
            List<string> itemsAlreadyOnPage = new List<string>();
            List<SmartTargetPromotion> smartTargetPromotions = new List<SmartTargetPromotion>();
            
            ResultSet resultSet = SmartTargetQueryResultSet(smartTargetPageModel, localization);

            // Check if there are any promotions from the query
            if (resultSet.Promotions.Count > 0)
            {
                smartTargetPromotions = CreateSmartTargetQueryResults(resultSet.Promotions, localization, itemsAlreadyOnPage, smartTargetPageModel);
            }

            // Check if we have SmartTargetPromotions for the page
            if (smartTargetPromotions.Count <= 0)
            {
                return;
            }

            foreach (SmartTargetPromotion smartTargetPromotion in smartTargetPromotions.Where(promotion => promotion.Items.Count > 0))
            {
                List<string> promotionRegions = SmartTargetUtils.SplitRegions(smartTargetPromotion.RegionName);

                foreach (string promotionRegion in promotionRegions)
                {
                    SmartTargetRegion smartTargetRegion = (SmartTargetRegion) smartTargetPageModel.Regions[promotionRegion];

                    if (smartTargetRegion == null)
                    {
                        throw new DxaException(string.Format("SmartTarget region '{0}', couldn't be found on the page",
                            promotionRegion));
                    }

                    smartTargetRegion.XpmMarkup = ResultSet.GetExperienceManagerMarkup(promotionRegion,
                        smartTargetRegion.MaxItems, resultSet.Promotions);

                    if (!smartTargetRegion.HasSmartTargetContent)
                    {
                        // Discard any fallback content coming from Content Manager
                        smartTargetRegion.Entities.Clear();
                    }

                    smartTargetRegion.HasSmartTargetContent = true;

                    foreach (SmartTargetItem smartTargetItem in smartTargetPromotion.Items)
                    {
                        smartTargetRegion.Entities.Add(smartTargetItem.Entity);
                    }
                }
            }
        }

        private static ResultSet SmartTargetQueryResultSet(SmartTargetPageModel smartTargetPageModel, Localization localization)
        {
            TcmUri pageUri = new TcmUri(string.Format("tcm:{0}-{1}-64", localization.LocalizationId, smartTargetPageModel.Id));
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="promotions"></param>
        /// <param name="localization"></param>
        /// <param name="itemsAlreadyOnPage"></param>
        /// <param name="smartTargetPageModel"></param>
        /// <returns></returns>
        private static List<SmartTargetPromotion> CreateSmartTargetQueryResults(List<Promotion> promotions, Localization localization, List<string> itemsAlreadyOnPage, SmartTargetPageModel smartTargetPageModel)
        {
            List<SmartTargetPromotion> smartTargetPromotions = new List<SmartTargetPromotion>();
            
            // go through all the page regions, so we can look for promotions
            foreach (SmartTargetRegion region in smartTargetPageModel.Regions.OfType<SmartTargetRegion>())
            {
                List<string> itemsOutputInRegion = new List<string>();
                ExperimentCookies newExperimentCookies = new ExperimentCookies();
                ExperimentCookies existingExperimentCookies = CookieProcessor.GetExperimentCookies(HttpContext.Current.Request);
                ExperimentDimensions experimentDimensions;

                ResultSet.FilterPromotions(promotions, region.Name, region.MaxItems, smartTargetPageModel.AllowDuplicates, itemsOutputInRegion,
                    itemsAlreadyOnPage, ref existingExperimentCookies, ref newExperimentCookies,
                    out experimentDimensions);

                // find all visible promotions for this region
                foreach (Promotion promotion in promotions.Where(promotion => promotion.Visible))
                {                   
                    SmartTargetPromotion smartTargetPromotion = (promotion is Experiment)
                        ? new SmartTargetExperiment()
                        : new SmartTargetPromotion();

                    string promotionView = String.IsNullOrEmpty(localization.GetConfigValue("smarttarget.SmartTargetEntityPromotion"))
                        ? "SmartTarget:Entity:Promotion"
                        : localization.GetConfigValue("smarttarget.SmartTargetEntityPromotion");

                    // TODO experiments
                    /*string experiementView = String.IsNullOrEmpty(localization.GetConfigValue("smarttarget.SmartTargetEntityExperiment"))
                        ? "SmartTarget:Entity:Experiment"
                        : localization.GetConfigValue("smarttarget.SmartTargetEntityExperiment");*/
                    
                    smartTargetPromotion.MvcData = new MvcData(promotionView);
                    smartTargetPromotion.PromotionId = promotion.PromotionId;
                    smartTargetPromotion.RegionName = promotion.Region;
                    smartTargetPromotion.Title = promotion.Title;
                    smartTargetPromotion.Slogan = promotion.Slogan;
                    
                    List<SmartTargetItem> smartTargetPromotionItems = new List<SmartTargetItem>();

                    foreach (Item item in promotion.Items.Where(item => item.Visible))
                    {
                        SmartTargetItem smartTargetItem = new SmartTargetItem(localization)
                        {
                            PromotionId = item.PromotionId,
                            RegionName = item.Region,
                            ComponentUri = item.ComponentUriAsString,
                            TemplateUri = item.TemplateUriAsString
                        };

                        smartTargetPromotionItems.Add(smartTargetItem);
                    }

                    smartTargetPromotion.Items = smartTargetPromotionItems;
                    smartTargetPromotions.Add(smartTargetPromotion);
                }
            }

            return smartTargetPromotions;
        }
    }
}
