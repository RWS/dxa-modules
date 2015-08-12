using Tridion.SmartTarget.Analytics;
using Tridion.SmartTarget.Query;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetExperiment : SmartTargetPromotion
    {
        public ExperimentDimensions ExperimentDimensions { get; set; }

        public ExperimentCookies NewExperimentCookies { get; set; }
    }
}
