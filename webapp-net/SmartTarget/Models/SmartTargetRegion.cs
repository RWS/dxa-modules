using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetRegion : RegionModel
    {
        
        public SmartTargetRegion(string name) : base(name)
        {
        }

        public SmartTargetRegion(string name, string qualifiedViewName) : base(name, qualifiedViewName)
        {
        }
        
        public bool HasSmartTargetContent { get; set; }

        public int MaxItems { get; set; }
        
        public string XpmMarkup { get; set; }

        public override string GetXpmMarkup(Localization localization)
        {
            return XpmMarkup;
        }
    }
}
