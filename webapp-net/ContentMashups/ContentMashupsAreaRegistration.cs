using Sdl.Web.Modules.ContentMashups.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.ContentMashups
{
    public class ContentMashupsAreaRegistration : BaseAreaRegistration 
    {
        public override string AreaName => "ContentMashups";

        protected override void RegisterAllViewModels()
        {
            RegisterViewModel("DocsContent", typeof(DocsContent) , "ContentMashups");
        }
    }
}
