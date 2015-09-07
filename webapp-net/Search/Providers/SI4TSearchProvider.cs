using System;
using System.Collections.Specialized;
using System.Globalization;
using System.Text.RegularExpressions;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Search.Models;
using SI4T.Query.Models;

namespace Sdl.Web.Modules.Search.Providers
{
    /// <summary>
    /// Abstract base class for SI4T-based Search Providers.
    /// </summary>
    public abstract class SI4TSearchProvider : ISearchProvider
    {
        #region ISearchProvider members
        public void ExecuteQuery(SearchQuery searchQuery, Type resultType, Localization localization)
        {
            using (new Tracer(searchQuery, resultType, localization))
            {
                string searchIndexUrl = GetSearchIndexUrl(localization);
                NameValueCollection parameters = SetupParameters(searchQuery, localization);
                SearchResults results = ExecuteQuery(searchIndexUrl, parameters);
                if (results.HasError)
                {
                    throw new DxaSearchException(String.Format("Error executing Search Query on URL '{0}': {1}", searchIndexUrl, results.ErrorDetail));
                }
                Log.Debug("Search Query '{0}' returned {1} results.", results.QueryText ?? results.QueryUrl, results.Total);

                searchQuery.Total = results.Total;
                searchQuery.HasMore = results.Start + results.PageSize <= results.Total;
                searchQuery.CurrentPage = results.PageSize == 0 ? 1 : results.Start / results.PageSize + 1;

                foreach (SearchResult result in results.Items)
                {
                    searchQuery.Results.Add(MapResult(result, resultType, searchQuery.SearchItemView));
                }
            }
        }
        #endregion

        protected virtual string GetSearchIndexUrl(Localization localization)
        {
            return localization.GetConfigValue("search." + (localization.IsStaging ? "staging" : "live") + "IndexConfig");
        }

        protected abstract SearchResults ExecuteQuery(string searchIndexUrl, NameValueCollection parameters);

        protected virtual SearchItem MapResult(SearchResult result, Type modelType, string viewName)
        {
            SearchItem searchItem = (SearchItem)Activator.CreateInstance(modelType);
            searchItem.MvcData = new MvcData(viewName);

            searchItem.Title = result.Title;
            searchItem.Url = result.Url;
            searchItem.Summary = result.Summary;
            searchItem.CustomFields = result.CustomFields;

            return searchItem;
        }

        protected virtual NameValueCollection SetupParameters(SearchQuery searchQuery, Localization localization)
        {
            // TODO: also needed for CloudSearch?
            string escapedQuery = Regex.Replace(searchQuery.QueryText, @"([\\&|+\-!(){}[\]^\""~*?:])", match => @"\" + match.Groups[1].Value);

            NameValueCollection result = new NameValueCollection(searchQuery.QueryStringParameters);
            result["fq"] = "publicationid:" + localization.LocalizationId;
            result["q"] = escapedQuery;
            result["start"] = searchQuery.Start.ToString(CultureInfo.InvariantCulture);
            result["rows"] = searchQuery.PageSize.ToString(CultureInfo.InvariantCulture);

            return result;
        }
    }
}
