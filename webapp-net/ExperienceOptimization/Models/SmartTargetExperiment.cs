using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tridion.SmartTarget.Analytics;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetExperiment : SmartTargetPromotion
    {
        public ExperimentDimensions ExperimentDimensions { get; private set; }

        public SmartTargetExperiment(ExperimentDimensions experimentDimensions)
        {
            ExperimentDimensions = experimentDimensions;
        }
    }
}
