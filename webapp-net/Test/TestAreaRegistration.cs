using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Core.Models;
using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Modules.Test.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Test
{
    public class TestAreaRegistration : BaseAreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Test";
            }
        }

        protected override void RegisterAllViewModels()
        {
            // Core Views
            RegisterCoreViewModels();

            // Page Views
            RegisterViewModel("TestPage1", typeof(PageModel), "Page");
            RegisterViewModel("TestPage2", typeof(PageModel), "Page");
            RegisterViewModel("TestPageMarkup", typeof(PageModel), "Page");
            RegisterViewModel("CustomPageModelTest", typeof(CustomPageModel), "Page");
            RegisterViewModel("TestPageCSS", typeof(PageModel), "Page");
            RegisterViewModel("TestPageCSSNoParams", typeof(PageModel), "Page");
            RegisterViewModel("TestPageInheritedController", typeof(PageModel));
            RegisterViewModel("CustomPageModelInheritedController", typeof(CustomPageModel));
            RegisterViewModel("TestDxaEntityViewOverride", typeof(PageModel));
            RegisterViewModel("SimpleTestPage", typeof(PageModel));
            RegisterViewModel("TSI811TestPage", typeof(Tsi811PageModel));

            // Region Views
            RegisterViewModel("TestRegion1", typeof(RegionModel), "Region");
            RegisterViewModel("CustomRegionModelTest", typeof(CustomRegionModel), "Region");
            RegisterViewModel("TestRegion2", typeof(RegionModel), "Region");
            RegisterViewModel("TestRegion3", typeof(RegionModel), "Region");
            RegisterViewModel("TestRegionMarkup", typeof(RegionModel), "Region");
            RegisterViewModel("TestRegionEntity", typeof(RegionModel), "Region");
            RegisterViewModel("TestRegionInheritedController", typeof(RegionModel));
            RegisterViewModel("CustomRegionModelInheritedController", typeof(CustomRegionModel));
            RegisterViewModel("PromoRegionTest", typeof(SmartTargetRegion), "Region");

            // Entity Views
            RegisterViewModel("TestEntity1", typeof(TestEntityModel1));
            RegisterViewModel("TestEntity2", typeof(TestEntityModel1));
            RegisterViewModel("TestEntity3", typeof(TestEntityModel1));
            RegisterViewModel("TestEntityCSSEmpty", typeof(TestEntityModel1));
            RegisterViewModel("TestEntityCSSNoParams", typeof(TestEntityModel1));
            RegisterViewModel("TestEclEntity", typeof(TestEclEntityModel));
            RegisterViewModel("TestEntityWithEclLink", typeof(TestEntityWithEclLink));
            RegisterViewModel("TestFlickrImage", typeof(TestFlickrImageModel));
            RegisterViewModel("Article", typeof(ArticleModel));
            RegisterViewModel("EmbedParent", typeof(EmbedParentModel));
            RegisterViewModel("TSI1758Test", typeof(Tsi1758TestEntity));
            RegisterViewModel("TSI1947Test", typeof(ArticleModel));
            RegisterViewModel("TSI811Test", typeof(Tsi811TestEntity));
            RegisterViewModel("TSI1946Test", typeof(Tsi1946TestEntity));

            // Entity Models without associated View
            RegisterViewModel(typeof(TestEntityModel2));
            RegisterViewModel(typeof(TestEntityModel3));
            RegisterViewModel(typeof(EmbedChildModel));
        }

        internal void RegisterCoreViewModels()
        {
            // Entity Views
            RegisterViewModel("Accordion", typeof(ItemList));
            RegisterViewModel("Article", typeof(Article));
            RegisterViewModel("Carousel", typeof(ItemList));
            RegisterViewModel("CookieNotificationBar", typeof(Notification));
            RegisterViewModel("Download", typeof(Download));
            RegisterViewModel("FooterLinkGroup", typeof(LinkList<Link>));
            RegisterViewModel("FooterLinks", typeof(LinkList<Link>));
            RegisterViewModel("HeaderLinks", typeof(LinkList<Link>));
            RegisterViewModel("HeaderLogo", typeof(Teaser));
            RegisterViewModel("Image", typeof(Image));
            RegisterViewModel("LanguageSelector", typeof(Common.Models.Configuration));
            RegisterViewModel("OldBrowserNotificationBar", typeof(Notification));
            RegisterViewModel("Place", typeof(Place));
            RegisterViewModel("SocialLinks", typeof(LinkList<TagLink>));
            RegisterViewModel("SocialSharing", typeof(LinkList<TagLink>));
            RegisterViewModel("Tab", typeof(ItemList));
            RegisterViewModel("Teaser-ImageOverlay", typeof(Teaser));
            RegisterViewModel("Teaser", typeof(Teaser));
            RegisterViewModel("TeaserColored", typeof(Teaser));
            RegisterViewModel("TeaserHero-ImageOverlay", typeof(Teaser));
            RegisterViewModel("TeaserMap", typeof(Teaser));
            RegisterViewModel("YouTubeVideo", typeof(YouTubeVideo));

            RegisterViewModel("List", typeof(ContentList<Teaser>), "List");
            RegisterViewModel("PagedList", typeof(ContentList<Teaser>), "List");
            RegisterViewModel("ThumbnailList", typeof(ContentList<Teaser>), "List");

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
