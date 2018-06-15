using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocs.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.TridionDocs
{
    /// <summary>
    /// Tridion Docs module area registration
    /// </summary>
    public class TridionDocsModuleAreaRegistration : BaseAreaRegistration
    {
        public static string AREA_NAME = "TridionDocs";
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
