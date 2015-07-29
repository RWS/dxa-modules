using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetRegionConfig
    {
        public string PageId { get; set; }

        public string RegionName { get; set; }

        public int MaxItems { get; set; }

        public bool AllowDuplicates { get; set; }
    }
}
