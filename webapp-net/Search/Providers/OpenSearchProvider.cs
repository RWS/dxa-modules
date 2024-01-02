using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Search.Data;
using Sdl.Web.Modules.Search.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Tridion.ContentManager;
using Sdl.Web.Tridion.Mapping;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.Linq;
using System.Reflection;
using MvcData = Sdl.Web.Common.Models.MvcData;

namespace Sdl.Web.Modules.Search.Providers
{
    /// <summary>
    /// Abstract base class for SI4T-based Search Providers.
    /// </summary>
    public abstract class OpenSearchProvider : ISearchProvider
    {
        private static readonly string DEFAULT_DYNAMIC_FIELD_NAME = "dynamic";
        private static readonly string DEFAULT_CONTENT_FIELD_NAME = "content";
        private static readonly string DEFAULT_SEPARATOR = "."; // used to be .
        private static readonly string DEFAULT_LANGUAGE = "english";
        private readonly string _separator = DEFAULT_SEPARATOR;
        private readonly string _defaultLanguage = DEFAULT_LANGUAGE;
        private readonly string _defaultDynamicFieldName = DEFAULT_DYNAMIC_FIELD_NAME;
        private readonly string _defaultContentFieldName = DEFAULT_CONTENT_FIELD_NAME;

        private string ContentField(string language) => $"{_defaultContentFieldName}{_separator}{language}";


        #region ISearchProvider members
        public void ExecuteQuery(SearchQuery searchQuery, Type resultType, Localization localization)
        {
            using (new Tracer(searchQuery, resultType, localization))
            {
                NameValueCollection parameters = SetupParameters(searchQuery, localization);
                var resultSet = ExecuteQuery(parameters);

                Log.Debug("Search QueryText '{0}' returned {1} results.", searchQuery.QueryText, resultSet.Hits);

                searchQuery.Total = resultSet.Hits;
                searchQuery.HasMore = searchQuery.Start + searchQuery.PageSize <= resultSet.Hits;
                searchQuery.CurrentPage = ((searchQuery.Start - 1) / searchQuery.PageSize) + 1;

                foreach (SearchResult result in resultSet.QueryResults)
                {
                    searchQuery.Results.Add(MapResult(result, resultType, searchQuery.SearchItemView));
                }
            }
        }
        #endregion


        protected abstract SearchResultSet ExecuteQuery(NameValueCollection parameters);

        protected virtual SearchItem MapResult(SearchResult result, Type modelType, string viewName)
        {
            string contentLanguageFilter = ContentField(GetLanguage(WebRequestContext.Localization.Culture));
            SearchItem searchItem = (SearchItem)Activator.CreateInstance(modelType);
            searchItem.MvcData = new MvcData(viewName);
            searchItem.Id = result.Id;
            //searchItem.Title = GetContentTitle(result.Id.Replace("_", ":"), result.PageTitle);
            searchItem.Title = result.PageTitle;
            searchItem.Url = result.Url;
            searchItem.Summary = GetTrimmedContent(result.Highlighted.Contains(contentLanguageFilter) ? result.Highlighted[contentLanguageFilter].ToString() : result.Content);
            searchItem.CustomFields = new Dictionary<string, object>();
            if (result.Meta != null)
            {
                foreach (DictionaryEntry entry in result.Meta)
                {
                    // Convert the key and value to strings
                    string key = entry.Key.ToString();
                    string value = entry.Value?.ToString();

                    // Add the key-value pair to CustomFields
                    searchItem.CustomFields[key] = value;
                }
            }

            return searchItem;
        }

        public static string GetTrimmedContent(string content)
        {
            return content.Trim('[', ']').Replace("\"", "");
        }

        private string GetLanguage(string language) => string.IsNullOrEmpty(language) ? _defaultLanguage : CultureInfo.GetCultureInfo(language.Split('-')[0]).EnglishName.ToLower();

        private string GetContentTitle(string pageUri, string pageTitle)
        {
            if (string.IsNullOrEmpty(pageUri)) { return string.Empty; }

            TcmUri tcmUri = new TcmUri(pageUri);
            bool addIncludes = false;
            DefaultContentProvider defaultContentProvider = new DefaultContentProvider();
            PageModel pageModel = defaultContentProvider.GetPageModel(tcmUri.ItemId, WebRequestContext.Localization, addIncludes);

            if (pageModel == null)
            {
                return pageTitle;
            }
            HashSet<string> validRegionNames = new HashSet<string> { "Main" };
            foreach (var regions in pageModel.Regions)
            {
                if (validRegionNames.Contains(regions.Name) && regions.Entities.Any())
                {
                    foreach (var entity in regions.Entities)
                    {
                        if (entity != null)
                        {
                            Type entityType = entity.GetType();

                            // Check if the entity is of type Article using reflection
                            if (entityType.FullName == "Sdl.Web.Modules.Core.Models.Article")
                            {
                                PropertyInfo headlineProperty = entityType.GetProperty("Headline");
                                if (headlineProperty != null)
                                {
                                    object headlineValue = headlineProperty.GetValue(entity);
                                    if (headlineValue != null)
                                    {
                                        return headlineValue.ToString();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return pageTitle;
        }

        protected virtual NameValueCollection SetupParameters(SearchQuery searchQuery, Localization localization)
        {
            NameValueCollection result = new NameValueCollection(searchQuery.QueryStringParameters);
            //result["fq"] = "publicationid:" + localization.Id; // TODO: What about CM URI scheme?
            result["q"] = searchQuery.QueryText;
            result["start"] = searchQuery.Start.ToString(CultureInfo.InvariantCulture);
            result["rows"] = searchQuery.PageSize.ToString(CultureInfo.InvariantCulture);

            return result;
        }
    }
}
