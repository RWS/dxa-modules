using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Modules.SmartTarget.Models;

namespace Sdl.Web.Modules.SmartTarget
{
    public class SmartTargetAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "SmartTarget";
            }
        }

        protected override void RegisterAllViewModels()
        {
            // SmartTarget Entity Views
            RegisterViewModel("Example1", typeof(SmartTargetRegion), "Region");
            RegisterViewModel("Example2", typeof(SmartTargetRegion), "Region");

        }
    }
}
