using Sdl.Web.Modules.SmartTarget.Models;
using System.Collections.Generic;
using System.Web;
using Tridion.ContentDelivery.AmbientData;
using Tridion.SmartTarget.Analytics;
using Tridion.SmartTarget.Query;
using Tridion.SmartTarget.Query.Builder;
using Tridion.SmartTarget.Utils;

namespace Sdl.Web.Modules.SmartTarget.SmartTargetQuery
{
    public class SmartTargetQuery
    {
        /// <summary>
        /// Retrieves the SmartTargetQueryResults for each SmartTargetRegionConfig
        /// </summary>
        /// <param name="regionConfigList"></param>
        /// <returns></returns>
        public static List<SmartTargetQueryResult> GetPagePromotions(List<SmartTargetRegionConfig> regionConfigList)
        {
            List<SmartTargetQueryResult> queryResults = new List<SmartTargetQueryResult>();

            List<string> itemsAlreadyOnPage = new List<string>();
            foreach (SmartTargetRegionConfig regionConfig in regionConfigList)
            {
                SmartTargetQueryResult queryResult = GetRegionPromotions(regionConfig, itemsAlreadyOnPage);
                queryResults.Add(queryResult);
            }

            return queryResults;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="regionConfig"></param>
        /// <param name="itemsAlreadyOnPage"></param>
        /// <returns></returns>
        public static SmartTargetQueryResult GetRegionPromotions(SmartTargetRegionConfig regionConfig, List<string> itemsAlreadyOnPage)
        {
            SmartTargetQueryResult queryResult = new SmartTargetQueryResult();
            queryResult.RegionName = regionConfig.RegionName;

            TcmUri pageUri = new TcmUri(regionConfig.PageId);
            TcmUri publicationUri = new TcmUri(0, pageUri.PublicationId, 1);

            //TODO; via TRI??
            ClaimStore claimStore = AmbientDataContext.CurrentClaimStore;
            string triggers = AmbientDataHelper.GetTriggers(claimStore);

            QueryBuilder queryBuilder = new QueryBuilder();
            queryBuilder.Parse(triggers);
            queryBuilder.AddCriteria(new PublicationCriteria(publicationUri));
            queryBuilder.AddCriteria(new PageCriteria(pageUri));
            queryBuilder.AddCriteria(new RegionCriteria(regionConfig.RegionName));

            if (regionConfig.MaxItems > 0)
            {
                queryBuilder.MaxItems = regionConfig.MaxItems;
            }

            ResultSet fredHopperResultset = queryBuilder.Execute();

            if (fredHopperResultset.Promotions.Count > 0)
            {
                queryResult.Promotions = ProcessRegionPromotions(fredHopperResultset.Promotions, publicationUri, pageUri, regionConfig.RegionName, regionConfig.MaxItems, regionConfig.AllowDuplicates, itemsAlreadyOnPage);
                queryResult.HasSmartTargetContent = true;
            }

            string xmpQueryMarkup = ResultSet.GetExperienceManagerMarkup(regionConfig.RegionName, regionConfig.MaxItems, fredHopperResultset.Promotions);
            queryResult.XpmMarkup = xmpQueryMarkup;

            return queryResult;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="promotions"></param>
        /// <param name="publicationUri"></param>
        /// <param name="pageUri"></param>
        /// <param name="region"></param>
        /// <param name="maxItems"></param>
        /// <param name="allowDuplicates"></param>
        /// <param name="itemsAlreadyOnPage"></param>
        /// <returns></returns>
        private static List<SmartTargetPromotion> ProcessRegionPromotions(List<Promotion> promotions, TcmUri publicationUri, TcmUri pageUri, string region, int maxItems, bool allowDuplicates, List<string> itemsAlreadyOnPage)
        {
            List<string> itemsOutputInRegion = new List<string>();
            ExperimentCookies newExperimentCookies = new ExperimentCookies();
            ExperimentCookies existingExperimentCookies = CookieProcessor.GetExperimentCookies(HttpContext.Current.Request);
            ExperimentDimensions experimentDimensions = null;

            //Method will populate experimentDimensions variable when an experiment is present. Also it will populate the newExperimentCookies variable when no existing experiment cookies are found
            ResultSet.FilterPromotions(promotions, region, maxItems, allowDuplicates, itemsOutputInRegion, itemsAlreadyOnPage, ref existingExperimentCookies, ref newExperimentCookies, out experimentDimensions);

            List<SmartTargetPromotion> smartTargetPromotions = new List<SmartTargetPromotion>();
            foreach (Promotion promotion in promotions)
            {
                SmartTargetExperiment smartTargetPromotion = new SmartTargetExperiment();

                if (experimentDimensions != null && experimentDimensions.ExperimentId.Equals(promotion.PromotionId))
                {
                    //Populate the remaining emtpy properties
                    experimentDimensions.PublicationId = publicationUri.ToString();
                    experimentDimensions.PageId = pageUri.ToString();
                    experimentDimensions.Region = region;

                    smartTargetPromotion = new SmartTargetExperiment()
                    {
                        ExperimentDimensions = experimentDimensions,
                        NewExperimentCookies = newExperimentCookies
                    };
                }

                smartTargetPromotion.PromotionId = promotion.PromotionId;
                smartTargetPromotion.RegionName = promotion.Region;
                smartTargetPromotion.Title = promotion.Title;
                smartTargetPromotion.Slogan = promotion.Slogan;
                smartTargetPromotion.IsVisible = promotion.Visible;

                List<SmartTargetItem> smartTargetPromotionItems = new List<SmartTargetItem>();

                foreach (Item item in promotion.Items)
                {
                    SmartTargetItem smartTargetItem = new SmartTargetItem
                    {
                        PromotionId = item.PromotionId,
                        RegionName = item.Region,
                        ComponentUri = item.ComponentUriAsString,
                        TemplateUri = item.TemplateUriAsString,
                        IsVisible = item.Visible
                    };
                    smartTargetPromotionItems.Add(smartTargetItem);
                }

                smartTargetPromotion.Items = smartTargetPromotionItems;
                smartTargetPromotions.Add(smartTargetPromotion);
            }
            return smartTargetPromotions;
        }
    }
}
