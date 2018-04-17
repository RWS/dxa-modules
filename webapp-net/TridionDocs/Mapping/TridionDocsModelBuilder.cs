using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.DataModel;
using Sdl.Web.Tridion.Mapping;

namespace Sdl.Web.Modules.TridionDocs.Mapping
{
    /// <summary>
    /// Tridion Docs Model Builder
    /// 
    /// Remaps 'Ish' mvc area to TridionDocs
    /// 
    /// Add to Web.Config:
    ///  <modelBuilderPipeline>
    ///     <add type = "Sdl.Web.Tridion.Mapping.DefaultModelBuilder, Sdl.Web.Tridion" />
    ///     <add type = "Sdl.Web.Modules.TridionDocs.Mapping.TridionDocsModelBuilder, Sdl.Web.Modules.TridionDocs" />
    ///     ...
    ///  </modelBuilderPipeline>
    /// </summary>
    public class TridionDocsModelBuilder : IPageModelBuilder, IEntityModelBuilder
    {
        public void BuildPageModel(ref PageModel pageModel, PageModelData pageModelData, bool includePageRegions,
            ILocalization localization)
        {
            DataModel.MvcData mvcData = pageModelData.MvcData;
            RemapMvcAreaName(ref mvcData);
        }

        public void BuildEntityModel(ref EntityModel entityModel, EntityModelData entityModelData, Type baseModelType,
            ILocalization localization)
        {
            DataModel.MvcData mvcData = entityModelData.MvcData;
            RemapMvcAreaName(ref mvcData);
        }

        private void RemapMvcAreaName(ref DataModel.MvcData mvcData)
        {
            if (mvcData != null && mvcData.AreaName != null &&
               mvcData.AreaName.Equals("Ish"))
            {
                mvcData.AreaName = TridionDocsModuleAreaRegistration.AREA_NAME;
            }
        }
    }
}
