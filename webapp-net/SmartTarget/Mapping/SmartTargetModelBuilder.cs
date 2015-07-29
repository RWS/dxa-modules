using DD4T.ContentModel;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Modules.SmartTarget.SmartTargetQuery;
using Sdl.Web.Modules.SmartTarget.Utils;
using Sdl.Web.Tridion.Mapping;
using System;
using System.Collections.Generic;
using Tridion.SmartTarget.Utils;
using IPage = DD4T.ContentModel.IPage;

namespace Sdl.Web.Modules.SmartTarget.Mapping
{
    public class SmartTargetModelBuilder : DefaultModelBuilder
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="pageModel"></param>
        /// <param name="page"></param>
        /// <param name="includes"></param>
        /// <param name="localization"></param>
        public override void BuildPageModel(ref PageModel pageModel, IPage page, IEnumerable<IPage> includes, Localization localization)
        {
            Log.Debug("Extending DefaultModelBuilder in Pipeline with SmartTargetModelBuilder");

            if (pageModel != null)
            {
                Dictionary<string, string> moduleMap;
                List<SmartTargetRegionConfig> regionConfigList;

                if (TryGetSmartTargetRegionConfiguration(page, out moduleMap, out regionConfigList))
                {
                    List<SmartTargetQueryResult> smartTargetQueryResults = SmartTargetQuery.SmartTargetQuery.GetPagePromotions(regionConfigList);
                    foreach (SmartTargetQueryResult smartTargetQueryResult in smartTargetQueryResults)
                    {
                        Log.Debug("Found query result for '{0}'", smartTargetQueryResult.RegionName);

                        SmartTargetRegion region = new SmartTargetRegion(smartTargetQueryResult.RegionName)
                        {
                            MvcData = new MvcData
                            {
                                AreaName = moduleMap[smartTargetQueryResult.RegionName],
                                ViewName = smartTargetQueryResult.RegionName,
                                ControllerName = SiteConfiguration.GetRegionController(),
                                ControllerAreaName = SiteConfiguration.GetDefaultModuleName(),
                                ActionName = SiteConfiguration.GetRegionAction()
                            },

                            XpmMarkup = smartTargetQueryResult.XpmMarkup,
                            HasSmartTargetContent = smartTargetQueryResult.HasSmartTargetContent
                        };

                        if (region.HasSmartTargetContent)
                        {
                            foreach (SmartTargetPromotion promotion in smartTargetQueryResult.Promotions)
                            {
                                RetrievePromotionEntities(promotion, localization);
                                region.Entities.Add(promotion);
                            }
                        }
                        else
                        {
                            RegionModel fallbackContent = pageModel.Regions.ContainsKey(region.Name) ? pageModel.Regions[region.Name] : null;

                            if (fallbackContent != null)
                            {
                                foreach (EntityModel promotion in fallbackContent.Entities)
                                {
                                    region.Entities.Add(promotion);
                                }
                            }
                        }

                        // Update of the Regions is required, therefore remove the old region and add the updated version.
                        pageModel.Regions.Remove(pageModel.Regions[region.Name]);
                        pageModel.Regions.Add(region);
                    }
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sourceEntity"></param>
        /// <param name="moduleMap"></param>
        /// <param name="regionConfigList"></param>
        /// <returns></returns>
        private bool TryGetSmartTargetRegionConfiguration(object sourceEntity, out Dictionary<string, string> moduleMap, out List<SmartTargetRegionConfig> regionConfigList)
        {
            moduleMap = new Dictionary<string, string>();
            regionConfigList = new List<SmartTargetRegionConfig>();

            IPage page = sourceEntity as IPage;
            if (page != null && page.PageTemplate.MetadataFields.ContainsKey("smartTargetRegions"))
            {
                foreach (IFieldSet smartTargetRegion in page.PageTemplate.MetadataFields["smartTargetRegions"].EmbeddedValues)
                {
                    string module;
                    string regionName;

                    //Region name is a mandatory field; write directly
                    SmartTargetUtils.DetermineRegionViewNameAndModule(smartTargetRegion["regionName"].Value, out module, out regionName);
                    moduleMap[regionName] = module;

                    //Max items is a mandatory field; write directly
                    int maxItems = 0;
                    maxItems = Convert.ToInt32(smartTargetRegion["maxItems"].Value);

                    //Allow duplicates is an optional field, (Questionable if you want to have the option because of configuration).
                    bool allowDuplicates = SmartTargetUtils.DefaultAllowDuplicates;
                    if (smartTargetRegion.ContainsKey("allowDuplicates"))
                    {
                        allowDuplicates = SmartTargetUtils.Parse(smartTargetRegion["allowDuplicates"].Value);
                    }

                    SmartTargetRegionConfig regionConfig = new SmartTargetRegionConfig
                    {
                        PageId = page.Id,
                        RegionName = regionName,
                        MaxItems = maxItems,
                        AllowDuplicates = allowDuplicates
                    };

                    regionConfigList.Add(regionConfig);
                }

                return true;
            }

            return false;
        }

        private void RetrievePromotionEntities(SmartTargetPromotion promotion, Localization localization)
        {
            foreach (SmartTargetItem promotionItem in promotion.Items)
            {
                if (promotionItem.IsVisible)
                {
                    TcmUri componentUri = new TcmUri(promotionItem.ComponentUri);
                    TcmUri templateUri = new TcmUri(promotionItem.TemplateUri);
                    EntityModel entitymodel = SiteConfiguration.ContentProvider.GetEntityModel(string.Format("{0}-{1}", componentUri.ItemId, templateUri.ItemId), localization);

                    if (entitymodel.Id != null)
                    {
                        promotionItem.Entity = entitymodel;
                    }
                }
            }
        }
    }
}
