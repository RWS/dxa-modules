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

            // Entity Models without associated View
            RegisterViewModel(typeof(TestEntityModel2));
            RegisterViewModel(typeof(TestEntityModel3));
        }
    }
}
