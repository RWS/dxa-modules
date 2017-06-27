using System;
using Sdl.Web.Common;
using Tridion.SmartTarget.Analytics;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    [Serializable]
    [DxaNoOutputCache]
    [DxaNoCache]
    public class SmartTargetExperiment : SmartTargetPromotion
    {
        public ExperimentDimensions ExperimentDimensions { get; private set; }

        public SmartTargetExperiment(ExperimentDimensions experimentDimensions)
        {
            ExperimentDimensions = experimentDimensions;
        }
    }
}
