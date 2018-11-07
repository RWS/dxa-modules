using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models.Widgets;
using Sdl.Web.Modules.TridionDocsMashup.Models.Products;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.TridionDocsMashup
{
    public class TridionDocsMashupAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName => "TridionDocsMashup";

        protected override void RegisterAllViewModels()
        {
            // Widget Views
            RegisterViewModel("StaticWidget", typeof(StaticWidget), "TridionDocsMashup");
            RegisterViewModel("DynamicWidget", typeof(DynamicWidget), "TridionDocsMashup");

            // Product Views
            RegisterViewModel("Bicycle", typeof(Bicycle));

            // Region Views
            RegisterViewModel("Bicycle", typeof(RegionModel));
            RegisterViewModel("Topics", typeof(RegionModel));

            // Strongly Typed Topic Models
            RegisterViewModel(typeof(Topic));
        }
    }
}
