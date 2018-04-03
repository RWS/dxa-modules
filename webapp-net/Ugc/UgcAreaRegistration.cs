using Sdl.Web.Modules.Ugc.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Ugc
{
    public class UgcAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName => "Ugc";

        protected override void RegisterAllViewModels()
        {
            // Entity Views           
            RegisterViewModel("UgcCommentList", typeof(UgcCommentList), "Ugc");

            RegisterViewModel("UgcPostCommentForm", typeof(UgcPostCommentForm), "Ugc");
        }
    }
}
