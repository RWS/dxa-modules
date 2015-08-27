using System;
using System.Collections.Specialized;
using System.Linq;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Search.Models;
using Sdl.Web.Modules.Search.Providers;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Search.Controllers
{
    public class SearchController : BaseEntityController
    {
        public SearchController(ISearchProvider searchProvider)
        {
            SearchProvider = searchProvider;
        }

        public ISearchProvider SearchProvider { get; set; }

        /// <summary>
        /// Enrich the SearchQuery View Model with request querystring parameters and populate the results using a configured Search Provider,.
        /// </summary>
        protected override ViewModel EnrichModel(ViewModel model)
        {
            using (new Tracer(model))
            {
                base.EnrichModel(model);

                SearchQuery searchQuery = model as SearchQuery;
                if (searchQuery == null || !searchQuery.GetType().IsGenericType)
                {
                    throw new DxaSearchException(String.Format("Unexpected View Model: '{0}'. Expecting type SearchQuery<T>.", model));
                }

                NameValueCollection queryString = Request.QueryString;
                searchQuery.QueryText = queryString["q"];
                searchQuery.Start = queryString.AllKeys.Contains("start") ? Convert.ToInt32(queryString["start"]) : 1;

                SearchProvider.ExecuteQuery(searchQuery, searchQuery.GetType().GetGenericArguments()[0],
                    WebRequestContext.Localization);

                return searchQuery;
            }
        }
    }
}