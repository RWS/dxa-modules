using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Mvc.Configuration;

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
            RegisterViewModel("Example1", typeof(SmartTargetRegion), "Region");
            RegisterViewModel("Example2", typeof(SmartTargetRegion), "Region");
        }
    }
}
