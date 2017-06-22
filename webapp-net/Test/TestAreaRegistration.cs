using Sdl.Web.Common.Models;
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
            RegisterViewModel("TSI2285TestPage", typeof(Tsi2285PageModel));
            RegisterViewModel("CachingPage", typeof(CachingPageModel));

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
            RegisterViewModel("TSI1757Test3", typeof(Tsi1757TestEntity3));
            RegisterViewModel("TSI1856Test", typeof(Tsi1856TestEntity));
            RegisterViewModel("TSI2316Test", typeof(Tsi2316TestEntity));
            RegisterViewModel("CompLinkTest", typeof(CompLinkTest));
            RegisterViewModel("CachingEntity", typeof(CachingEntityModel));

            // Entity Models without associated View
            RegisterViewModel(typeof(TestEntityModel2));
            RegisterViewModel(typeof(TestEntityModel3));
            RegisterViewModel(typeof(EmbedChildModel));
            RegisterViewModel(typeof(Tsi1757TestEntity1));
            RegisterViewModel(typeof(Tsi1757TestEntity2));
            RegisterViewModel(typeof(TestEntity));
        }
    }
}
