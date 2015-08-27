using Sdl.Web.Modules.Search.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Search
{
    public class SearchAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName
        {
            get { return "Search"; }
        }

        protected override void RegisterAllViewModels()
        {
            // Search Entity Views
            RegisterViewModel("SearchBox", typeof(SearchBox));
            RegisterViewModel("SearchItem", typeof(SearchItem));
            RegisterViewModel("SearchResults", typeof(SearchQuery<SearchItem>), "Search");
        }
    }
}