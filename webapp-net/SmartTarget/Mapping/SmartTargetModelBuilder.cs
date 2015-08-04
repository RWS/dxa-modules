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
using System.Linq;
using IPage = DD4T.ContentModel.IPage;

namespace Sdl.Web.Modules.SmartTarget.Mapping
{
    public class SmartTargetModelBuilder : IModelBuilder
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="pageModel"></param>
        /// <param name="page"></param>
        /// <param name="includes"></param>
        /// <param name="localization"></param>
        public void BuildPageModel(ref PageModel pageModel, IPage page, IEnumerable<IPage> includes, Localization localization)
        {
            using (new Tracer(pageModel, page, includes, localization))
            {
                if (pageModel == null || !pageModel.Regions.OfType<SmartTargetRegion>().Any())
                {
                    return;
                }
                
                Dictionary<string, string> moduleMap;
                List<SmartTargetRegionConfig> regionConfigList;

                if (TryGetSmartTargetRegionConfiguration(page, out moduleMap, out regionConfigList))
                {
                    List<SmartTargetQueryResult> smartTargetQueryResults = SmartTargetQuery.SmartTargetQuery.GetPagePromotions(regionConfigList, localization);

                    foreach (SmartTargetQueryResult smartTargetQueryResult in smartTargetQueryResults)
                    {
                        SmartTargetRegion region = pageModel.Regions[smartTargetQueryResult.RegionName] as SmartTargetRegion;

                        if (region != null)
                        {
                            region.XpmMarkup = smartTargetQueryResult.XpmMarkup;

                            if (smartTargetQueryResult.HasSmartTargetContent)
                            {
                                if (!region.HasSmartTargetContent)
                                {
                                    region.Entities.Clear(); // Discard any fallback content coming from CM
                                }

                                region.HasSmartTargetContent = true;

                                foreach (SmartTargetPromotion promotion in smartTargetQueryResult.Promotions)
                                {
                                    region.Entities.Add(promotion);
                                }
                            }
                        }                        
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
            //Maybe check for ModuleName in the metadata
            if (page != null && page.PageTemplate.MetadataFields.ContainsKey("regions"))
            {
                foreach (IFieldSet smartTargetRegion in page.PageTemplate.MetadataFields["regions"].EmbeddedValues)
                {
                    string module;
                    string regionName;

                    //Region name is a mandatory field; write directly
                    SmartTargetUtils.DetermineRegionViewNameAndModule(smartTargetRegion["view"].Value, out module, out regionName);
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

        public void BuildEntityModel(ref EntityModel entityModel, IComponentPresentation cp, Localization localization)
        {
        }

        public void BuildEntityModel(ref EntityModel entityModel, IComponent component, Type baseModelType, Localization localization)
        {
        }
    }
}
