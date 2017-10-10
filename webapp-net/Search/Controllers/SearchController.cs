using System;
using System.Collections.Specialized;
using System.Linq;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Search.Models;
using Sdl.Web.Modules.Search.Providers;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;

namespace Sdl.Web.Modules.Search.Controllers
{
    public class SearchController : EntityController
    {
        protected ISearchProvider SearchProvider { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="searchProvider">The Search Provider to use. Set using Dependency Injection (ISearchProvider interface must be defined in Unity.config)</param>
        public SearchController(ISearchProvider searchProvider)
        {
            SearchProvider = searchProvider;
        }

        /// <summary>
        /// Enrich the SearchQuery View Model with request querystring parameters and populate the results using a configured Search Provider.
        /// </summary>
        protected override ViewModel EnrichModel(ViewModel model)
        {
            using (new Tracer(model))
            {
                base.EnrichModel(model);

                SearchQuery searchQuery = model as SearchQuery;
                if (searchQuery == null || !searchQuery.GetType().IsGenericType)
                {
                    throw new DxaSearchException($"Unexpected View Model: '{model}'. Expecting type SearchQuery<T>.");
                }

                NameValueCollection queryString = Request.QueryString;
                // Map standard query string parameters
                searchQuery.QueryText = queryString["q"];
                searchQuery.Start = queryString.AllKeys.Contains("start") ? Convert.ToInt32(queryString["start"]) : 1;
                // To allow the Search Provider to use additional query string parameters:
                searchQuery.QueryStringParameters = queryString;

                Type searchItemType = searchQuery.GetType().GetGenericArguments()[0];
                SearchProvider.ExecuteQuery(searchQuery, searchItemType, WebRequestContext.Localization);

                return searchQuery;
            }
        }
    }
}