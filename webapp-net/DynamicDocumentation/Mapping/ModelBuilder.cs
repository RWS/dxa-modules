using System;
using Sdl.Web.Common.Models;
using Sdl.Web.DataModel;
using Sdl.Web.Tridion.Mapping;

namespace Sdl.Web.Modules.DynamicDocumentation.Mapping
{
    /// <summary>
    /// Model Builder
    /// 
    /// Remaps 'Ish' mvc area to DynamicDocumentation
    /// 
    /// Add to Web.Config:
    ///  <modelBuilderPipeline>
    ///     <add type = "Sdl.Web.Tridion.Mapping.DefaultModelBuilder, Sdl.Web.Tridion" />
    ///     <add type = "Sdl.Web.Modules.DDWebAppReact.Mapping.DDWebAppModelBuilder, Sdl.Web.Modules.DDWebAppReact" />
    ///     ...
    ///  </modelBuilderPipeline>
    /// </summary>
    public class ModelBuilder : IPageModelBuilder, IEntityModelBuilder
    {
        public void BuildPageModel(ref PageModel pageModel, PageModelData pageModelData, bool includePageRegions,
            Common.Configuration.Localization localization)
        {
            DataModel.MvcData mvcData = pageModelData.MvcData;
            RemapMvcAreaName(ref mvcData);
        }

        public void BuildEntityModel(ref EntityModel entityModel, EntityModelData entityModelData, Type baseModelType,
            Common.Configuration.Localization localization)
        {
            DataModel.MvcData mvcData = entityModelData.MvcData;
            RemapMvcAreaName(ref mvcData);
        }

        private void RemapMvcAreaName(ref DataModel.MvcData mvcData)
        {
            if (mvcData != null && mvcData.AreaName != null &&
               mvcData.AreaName.Equals("Ish"))
            {
                mvcData.AreaName = DynamicDocumentationModuleAreaRegistration.AREA_NAME;
            }
        }
    }
}
