using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.TridionDocsMashup
{
    public class TridionDocsMashupAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName => "TridionDocsMashup";

        protected override void RegisterAllViewModels()
        {
            RegisterViewModel("DocsContent", typeof(DocsContent), "TridionDocsMashup");
        }
    }
}
