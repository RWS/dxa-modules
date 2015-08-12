using DD4T.ContentModel;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Tridion.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Modules.SmartTarget.Utils;
using IPage = DD4T.ContentModel.IPage;

namespace Sdl.Web.Modules.SmartTarget.Mapping
{
    public class SmartTargetModelBuilder : IModelBuilder
    {
        /// <summary>
        /// Update page and regions with proper SmartTarget content
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
                
                // pageModel does not contain maxItems of the region metadata fields
                // check if we have a page so we can poppulate these fields, if not return;
                if (page == null || !page.PageTemplate.MetadataFields.ContainsKey("regions"))
                {
                    return;
                }

                string allowDuplicationOnSamePage = page.PageTemplate.MetadataFields.ContainsKey("allowDuplicationOnSamePage") ? page.PageTemplate.MetadataFields["allowDuplicationOnSamePage"].Value : "";
                SmartTargetPageModel smartTargetPageModel = new SmartTargetPageModel(pageModel)
                {
                    AllowDuplicates = SmartTargetUtils.ParseAllowDuplicatesOnSamePage(allowDuplicationOnSamePage, localization)
                };
                
                // read custom metadata on the region, place these information into the SmartTargetPageModel
                foreach (IFieldSet smartTargetRegionField in page.PageTemplate.MetadataFields["regions"].EmbeddedValues)
                {
                    string regionName = SmartTargetUtils.DetermineRegionName(smartTargetRegionField["view"].Value);
                    SmartTargetRegion smartTargetRegion = smartTargetPageModel.Regions[regionName] as SmartTargetRegion;

                    if (smartTargetRegion != null)
                    {
                        int maxItems = smartTargetRegionField.ContainsKey("maxItems") ? Convert.ToInt32(smartTargetRegionField["maxItems"].Value) : 0;
                        smartTargetRegion.MaxItems = maxItems;
                    }
                }
                
                SmartTargetQuery.SmartTargetQuery.SetPageRegionEntities(smartTargetPageModel, localization);
            }
        }
        
        public void BuildEntityModel(ref EntityModel entityModel, IComponentPresentation cp, Localization localization)
        {
        }

        public void BuildEntityModel(ref EntityModel entityModel, IComponent component, Type baseModelType, Localization localization)
        {
        }
    }
}
