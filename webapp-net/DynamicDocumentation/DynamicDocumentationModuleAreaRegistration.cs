using Sdl.Web.Common.Models;
using Sdl.Web.Modules.DynamicDocumentation.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.DynamicDocumentation
{
    /// <summary>
    /// DDWebAppReact module area registration
    /// </summary>
    public class DynamicDocumentationModuleAreaRegistration : BaseAreaRegistration
    {
        public static string AREA_NAME = "DynamicDocumentation";
        public override string AreaName => AREA_NAME;
        protected override void RegisterAllViewModels()
        {
            // Entity Views
            RegisterViewModel("Topic", typeof(Topic));

            // Page Views         
            RegisterViewModel("GeneralPage", typeof(PageModel));
            RegisterViewModel("ErrorPage", typeof(PageModel));
        }
    }
}
