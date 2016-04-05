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
            RegisterViewModel("SmartTargetRegion", typeof(SmartTargetRegion));
            RegisterViewModel("2-Column", typeof(SmartTargetRegion));
            RegisterViewModel("3-Column", typeof(SmartTargetRegion));
            RegisterViewModel("4-Column", typeof(SmartTargetRegion));

            RegisterViewModel("Promotion", typeof(SmartTargetPromotion));

            RegisterMarkupDecorator(typeof(ExperimentMarkupDecorator));
        }
    }
}
