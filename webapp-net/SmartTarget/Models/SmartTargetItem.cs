using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetItem
    {
        public string RegionName { get; set; }

        public string PromotionId { get; set; }

        public string ComponentUri { get; set; }

        public string TemplateUri { get; set; }

        public bool IsVisible { get; set; }

        public EntityModel Entity { get; set; }
    }
}
