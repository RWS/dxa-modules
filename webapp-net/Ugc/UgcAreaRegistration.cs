using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ugc.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Ugc
{
    public class UgcAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName => "Ugc";

        protected override void RegisterAllViewModels()
        {
            // Region
            RegisterViewModel("Comments", typeof(UgcRegion));

            // Entity
            RegisterViewModel("UgcComments", typeof(UgcComments), "Ugc");
            RegisterViewModel("UgcPostCommentForm", typeof(UgcPostCommentForm), "Ugc");

            // Page
            RegisterViewModel("GeneralPage", typeof(PageModel));
        }
    }
}
