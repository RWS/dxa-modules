using Sdl.Web.Common.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Core
{
    public class CoreAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Core";
            }
        }

        protected override void RegisterAllViewModels()
        {
            // Entity Views
            RegisterViewModel("Accordion", typeof(Sdl.Web.Modules.Core.Models.ItemList));
            RegisterViewModel("Article", typeof(Sdl.Web.Modules.Core.Models.Article));
            RegisterViewModel("Carousel", typeof(Sdl.Web.Modules.Core.Models.ItemList));
            RegisterViewModel("CookieNotificationBar", typeof(Sdl.Web.Modules.Core.Models.Notification));
            RegisterViewModel("Download", typeof(Sdl.Web.Modules.Core.Models.Download));
            RegisterViewModel("FooterLinkGroup", typeof(Sdl.Web.Modules.Core.Models.LinkList<Link>));
            RegisterViewModel("FooterLinks", typeof(Sdl.Web.Modules.Core.Models.LinkList<Link>));
            RegisterViewModel("HeaderLinks", typeof(Sdl.Web.Modules.Core.Models.LinkList<Link>));
            RegisterViewModel("HeaderLogo", typeof(Sdl.Web.Modules.Core.Models.Teaser));
            RegisterViewModel("Image", typeof(Sdl.Web.Modules.Core.Models.Image));
            RegisterViewModel("LanguageSelector", typeof(Configuration));
            RegisterViewModel("OldBrowserNotificationBar", typeof(Sdl.Web.Modules.Core.Models.Notification));
            RegisterViewModel("Place", typeof(Sdl.Web.Modules.Core.Models.Place));
            RegisterViewModel("SocialLinks", typeof(Sdl.Web.Modules.Core.Models.LinkList<TagLink>));
            RegisterViewModel("SocialSharing", typeof(Sdl.Web.Modules.Core.Models.LinkList<TagLink>));
            RegisterViewModel("Tab", typeof(Sdl.Web.Modules.Core.Models.ItemList));
            RegisterViewModel("Teaser-ImageOverlay", typeof(Sdl.Web.Modules.Core.Models.Teaser));
            RegisterViewModel("Teaser", typeof(Sdl.Web.Modules.Core.Models.Teaser));
            RegisterViewModel("TeaserColored", typeof(Sdl.Web.Modules.Core.Models.Teaser));
            RegisterViewModel("TeaserHero-ImageOverlay", typeof(Sdl.Web.Modules.Core.Models.Teaser));
            RegisterViewModel("TeaserMap", typeof(Sdl.Web.Modules.Core.Models.Teaser));
            RegisterViewModel("YouTubeVideo", typeof(Sdl.Web.Modules.Core.Models.YouTubeVideo));

            RegisterViewModel("List", typeof(Sdl.Web.Modules.Core.Models.ContentList<Sdl.Web.Modules.Core.Models.Teaser>), "List");
            RegisterViewModel("ArticleList", typeof(Sdl.Web.Modules.Core.Models.ContentList<Sdl.Web.Modules.Core.Models.Article>), "List");
            RegisterViewModel("PagedList", typeof(Sdl.Web.Modules.Core.Models.ContentList<Sdl.Web.Modules.Core.Models.Teaser>), "List");
            RegisterViewModel("ThumbnailList", typeof(Sdl.Web.Modules.Core.Models.ContentList<Sdl.Web.Modules.Core.Models.Teaser>), "List");

            RegisterViewModel("Breadcrumb", typeof(NavigationLinks), "Navigation");
            RegisterViewModel("LeftNavigation", typeof(NavigationLinks), "Navigation");
            RegisterViewModel("SiteMap", typeof(SitemapItem), "Navigation");
            RegisterViewModel("SiteMapXml", typeof(SitemapItem), "Navigation");
            RegisterViewModel("TopNavigation", typeof(NavigationLinks), "Navigation");

            // Page Views
            RegisterViewModel("GeneralPage", typeof(PageModel));
            RegisterViewModel("IncludePage", typeof(PageModel));
            RegisterViewModel("RedirectPage", typeof(PageModel));

            // Region Views
            RegisterViewModel("2-Column", typeof(RegionModel));
            RegisterViewModel("3-Column", typeof(RegionModel));
            RegisterViewModel("4-Column", typeof(RegionModel));
            RegisterViewModel("Hero", typeof(RegionModel));
            RegisterViewModel("Info", typeof(RegionModel));
            RegisterViewModel("Left", typeof(RegionModel));
            RegisterViewModel("Links", typeof(RegionModel));
            RegisterViewModel("Logo", typeof(RegionModel));
            RegisterViewModel("Main", typeof(RegionModel));
            RegisterViewModel("Nav", typeof(RegionModel));
            RegisterViewModel("Tools", typeof(RegionModel));

            // Region Views for Include Pages
            RegisterViewModel("Header", typeof(RegionModel));
            RegisterViewModel("Footer", typeof(RegionModel));
            RegisterViewModel("Left Navigation", typeof(RegionModel));
            RegisterViewModel("Content Tools", typeof(RegionModel));
        }
    }
}
