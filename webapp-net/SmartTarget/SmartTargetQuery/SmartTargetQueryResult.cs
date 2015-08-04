using System.Collections.Generic;
using Sdl.Web.Modules.SmartTarget.Models;

namespace Sdl.Web.Modules.SmartTarget.SmartTargetQuery
{
    public class SmartTargetQueryResult
    {
        public string RegionName { get; set; }

        public List<SmartTargetPromotion> Promotions { get; set; }

        public bool HasSmartTargetContent { get; set; }

        public string XpmMarkup { get; set; }
    }
}
