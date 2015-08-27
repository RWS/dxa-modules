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
        protected ISearchProvider SearchProvider { get; private set; }

        #region Constructors
        /// <summary>
        /// Parameterless constructor is used if no implementation type for <see cref="ISearchProvider"/> can be resolved.
        /// </summary>
        public SearchController()
        {
            SearchProvider = new SolrProvider();
        }

        /* TODO: as soon as we have this constructor, Unity wants to use it and throws an Exception if no ISearchProvider implementation is configured.
        /// <summary>
        /// Constructor that takes a <see cref="ISearchProvider"/> implementation (Dependency Injection).
        /// </summary>
        /// <param name="searchProvider">The <see cref="ISearchProvider"/> implementation</param>
        public SearchController(ISearchProvider searchProvider)
        {
            SearchProvider = searchProvider;
        }
        */
        #endregion

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