using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.TridionDocsMashup
{
    public class TridionDocsMashupAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName => "TridionDocsMashup";

        protected override void RegisterAllViewModels()
        {
            RegisterViewModel("StaticWidget", typeof(StaticWidget), "TridionDocsMashup");
            RegisterViewModel("DynamicWidget", typeof(DynamicWidget), "TridionDocsMashup");
            RegisterViewModel("Product", typeof(Product));

            // Region Views
            RegisterViewModel("DynamicWidget", typeof(RegionModel));
        }
    }
}
