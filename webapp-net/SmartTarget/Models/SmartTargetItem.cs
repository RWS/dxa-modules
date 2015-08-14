using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using Sdl.Web.Tridion.ContentManager;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetItem
    {
        private readonly Localization _localization;

        public string RegionName { get; set; }

        public string PromotionId { get; set; }

        public string ComponentUri { get; set; }

        public string TemplateUri { get; set; }
        
        public EntityModel Entity 
        {
            get
            {
                TcmUri componentUri = new TcmUri(ComponentUri);
                TcmUri templateUri = new TcmUri(TemplateUri);
                return SiteConfiguration.ContentProvider.GetEntityModel(string.Format("{0}-{1}", componentUri.ItemId, templateUri.ItemId), _localization);
            }
        }

        public SmartTargetItem(Localization localization)
        {
            _localization = localization;
        }
    }
}
