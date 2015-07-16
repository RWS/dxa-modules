using Sdl.Web.Common.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Search
{
    public class SearchAreaRegistration : BaseAreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Search";
            }
        }

        protected override void RegisterAllViewModels()
        {
            RegisterViewModel("SearchBox", typeof(SearchConfiguration));
            RegisterViewModel("SearchResults", typeof(SearchQuery<Teaser>), "Search");
        }
    }
}