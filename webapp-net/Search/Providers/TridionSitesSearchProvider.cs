using Sdl.Tridion.Api.Client.ContentModel;
using Sdl.Tridion.Api.IqQuery;
using Sdl.Tridion.Api.IqQuery.Model.Field;
using Sdl.Web.Common.Logging;
using Sdl.Web.Modules.Search.Data;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Tridion.ApiClient;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using SearchQuery = Sdl.Tridion.Api.IqQuery.Model.Search.SearchQuery;

namespace Sdl.Web.Modules.Search.Providers
{
    public class TridionSitesSearchProvider : OpenSearchProvider
    {
        private static readonly string DEFAULT_DYNAMIC_FIELD_NAME = "dynamic";
        private static readonly string DEFAULT_CONTENT_FIELD_NAME = "content";
        private static readonly string DEFAULT_SEPARATOR = "+"; // used to be .
        private static readonly string DEFAULT_LANGUAGE = "english";
        private static readonly string DEFAULT_NAMESPACE = "1";
        private static readonly Regex RegexpDoubleQuotes = new Regex("^\"(.*)\"$", RegexOptions.Compiled);
        private static readonly HashSet<string> Cjk = new HashSet<string> { "chinese", "japanese", "korean" };
        private readonly string _separator = DEFAULT_SEPARATOR;
        private readonly string _namespace = DEFAULT_NAMESPACE;
        private readonly string _defaultLanguage = DEFAULT_LANGUAGE;
        private readonly string _defaultDynamicFieldName = DEFAULT_DYNAMIC_FIELD_NAME;
        private readonly string _defaultContentFieldName = DEFAULT_CONTENT_FIELD_NAME;

        private string ContentField(string language) => $"{_defaultContentFieldName}{_separator}{language}";
        
        public TridionSitesSearchProvider()
        {
            try
            {
                _separator = WebConfigurationManager.AppSettings["iq-field-separator"] ?? DEFAULT_SEPARATOR;
                _defaultLanguage = WebConfigurationManager.AppSettings["iq-default-language"] ?? DEFAULT_LANGUAGE;
                _defaultContentFieldName = WebConfigurationManager.AppSettings["iq-default-content-field"] ?? DEFAULT_CONTENT_FIELD_NAME;
                _defaultDynamicFieldName = WebConfigurationManager.AppSettings["iq-default-dynamic-field"] ?? DEFAULT_DYNAMIC_FIELD_NAME;
                // if iq-namespace not specified in configuration it will be null and namespace will not be included in iq query (old behavior)
                _namespace = WebConfigurationManager.AppSettings["iq-namespace"]?? DEFAULT_NAMESPACE;
                Log.Debug($"using defaultLanguage = {_defaultLanguage}, separator = {_separator}, contentFieldName = {_defaultContentFieldName}, dynamicFieldName = {_defaultDynamicFieldName}");
            }
            catch (Exception e)
            {
                Log.Error(e);
            }
        }
        
        protected override SearchResultSet ExecuteQuery(NameValueCollection parameters)
        {
            using (new Tracer(parameters))
            {
                var client = ApiClientFactory.Instance.CreateClient();
                string after = "";
                int start = Convert.ToInt32(parameters["start"]);
                int pageSize = Convert.ToInt32(parameters["rows"]);

                if (start > 0)
                {
                    after = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{start - 1}"));
                }

                var lang = GetLanguage(WebRequestContext.Localization.Culture);
                ICriteria criteria = null;
                
                var queryString = GetSearchQueryString(parameters["q"]);
                var pubId = WebRequestContext.Localization.Id;

                if (Cjk.Contains(lang))
                {
                    if (pubId == null && string.IsNullOrEmpty(_namespace))
                    {
                        criteria = CompileMultiLangQuery(lang, queryString);
                    }
                    else
                    {
                        if (pubId != null && !string.IsNullOrEmpty(_namespace))
                        {
                            criteria = CompileMultiLangQuery("publicationId", pubId, "namespace", _namespace, lang, queryString);
                        }
                        else
                        {
                            if (pubId != null)
                                criteria = CompileMultiLangQuery("publicationId", pubId, lang,
                                    queryString);
                            else if (!string.IsNullOrEmpty(_namespace))
                                criteria = CompileMultiLangQuery("namespace", _namespace, lang,
                                    queryString);
                        }
                    }
                }
                else
                {
                    var fields = new List<string>();
                    var values = new List<object>();
                    if (pubId != null)
                    {
                        fields.Add("publicationId");
                        values.Add(new DefaultTermValue(pubId));
                    }
                    fields.Add("itemType");
                    values.Add(new DefaultTermValue("page"));

                    fields.Add(ContentField(lang));
                    values.Add(new DefaultTermValue(queryString)); //values.Add(new DefaultTermValue(GetSearchQueryString(searchParams)))
                    criteria = new SearchQuery().GroupedAnd(fields, values).Compile();
                }

                //var after = searchParams.StartIndex.HasValue ? Convert.ToBase64String(Encoding.ASCII.GetBytes($"{searchParams.StartIndex.Value}")) : null;
                var results = client.SearchByRawCriteria(criteria.RawQuery, new InputResultFilter { HighlightingIsEnabled = true, HighlightInAllIsEnabled = true },
                    new Pagination
                    {
                        First = pageSize,
                        After = after
                    });

                var resultSet = BuildResultSet(results);
                resultSet.Count = pageSize;
                resultSet.StartIndex = start;

                return resultSet;
            }
        }

        private string GetLanguage(string language) => string.IsNullOrEmpty(language) ? _defaultLanguage : CultureInfo.GetCultureInfo(language.Split('-')[0]).EnglishName.ToLower();

        private SearchResultSet BuildResultSet(FacetedSearchResults facetedSearchResults)
        {
            SearchResultSet searchResultSet = new SearchResultSet();
            searchResultSet.QueryResults = new List<SearchResult>();
            if (facetedSearchResults == null || facetedSearchResults.Results == null || facetedSearchResults.Results.Edges == null)
            {
                searchResultSet.Count = 0;
                searchResultSet.Hits = 0;
                searchResultSet.StartIndex = 0;             
                return searchResultSet;
            }

            searchResultSet.Hits = facetedSearchResults.Results.Hits ?? 0;

            foreach(var result in facetedSearchResults.Results.Edges)
            {
                SearchResult searchResult = new SearchResult
                {
                    Id = result.Node.Search.Id,
                    Content = result.Node.Search.MainContentField,                    
                    Language = result.Node.Search.Locale,
                    LastModifiedDate = result.Node.Search.ModifiedDate,
                    PublicationId = result.Node.Search.PublicationId ?? 0,
                    PublicationTitle = result.Node.Search.PublicationTitle,
                    PageTitle = result.Node.Search.RawLanguageTitle,
                    Meta = result.Node.Search.Fields,
                    Highlighted = result.Node.Search.Highlighted,
                    ItemType = result.Node.Search.ItemType,
                    SchemaId = result.Node.Search.SchemaId,
                    Url = result.Node.Search.Url
                };

                searchResultSet.QueryResults.Add(searchResult);                
            }
            return searchResultSet;
        }

        private static string GetSearchQueryString(string searchText)
        {
            // perform escaping if required
            string searchQuery = searchText;
            Match match = RegexpDoubleQuotes.Match(searchQuery);
            if (match.Success)
            {
                searchQuery = match.Groups[1].Value;
            }
            return searchQuery;
        }

        private ICriteria CompileMultiLangQuery(string language, string queryString) =>
            new SearchQuery()
                .GroupStart()
                .Field(ContentField("cjk"), queryString)
                .Or()
                .Field(ContentField(language), queryString)
                .GroupEnd()
                .Compile();

        private ICriteria CompileMultiLangQuery(string fieldName, object fieldValue, string language, string queryString) =>
            new SearchQuery()
                .GroupStart()
                .Field(fieldName, new DefaultTermValue(fieldValue))
                .GroupEnd()
                .And()
                .GroupStart()
                .Field(ContentField("cjk"), queryString)
                .Or()
                .Field(ContentField(language), queryString)
                .GroupEnd()
                .Compile();

        private ICriteria CompileMultiLangQuery(string fieldName1, object fieldValue1, string fieldName2, object fieldValue2, string language, string queryString) =>
            new SearchQuery()
                .GroupStart()
                .Field(fieldName1, new DefaultTermValue(fieldValue1))
                .GroupEnd()
                .And()
                .GroupStart()
                .Field(fieldName2, new DefaultTermValue(fieldValue2))
                .And()
                .GroupStart()
                .Field(ContentField("cjk"), queryString)
                .Or()
                .Field(ContentField(language), queryString)
                .GroupEnd()
                .GroupEnd()
                .Compile();
    }
}