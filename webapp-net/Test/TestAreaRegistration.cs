using Sdl.Web.Common.Models;
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

            // Region Views
            RegisterViewModel("TestRegion1", typeof(RegionModel), "Region");
<<<<<<< HEAD
            RegisterViewModel("CustomRegionModelTest", typeof(CustomRegionModel), "Region");
=======
            RegisterViewModel("TestRegion2", typeof(RegionModel), "Region");
            RegisterViewModel("TestRegion3", typeof(RegionModel), "Region");
>>>>>>> 3623c9b34d3698b86de072345872b98b0e47b625

            // Entity Views
            RegisterViewModel("TestEntity1", typeof(TestEntityModel1));
            RegisterViewModel("TestEntity1", typeof(TestEntityModel1));
            RegisterViewModel("TestEntity1", typeof(TestEntityModel1));

            // Entity Models without associated View
            RegisterViewModel(typeof(TestEntityModel2));
            RegisterViewModel(typeof(TestEntityModel3));
        }
    }
}
