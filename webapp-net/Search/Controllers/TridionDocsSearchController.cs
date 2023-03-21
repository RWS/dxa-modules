using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sdl.Web.Modules.Search.Data;
using Sdl.Web.Mvc.Controllers;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using Sdl.Tridion.Api.IqQuery;
using Sdl.Tridion.Api.IqQuery.Model.Field;
using Sdl.Tridion.Api.IqQuery.Model.Result;
using Sdl.Web.Tridion.ApiClient;
using Sdl.Tridion.Api.IqQuery.Model.Search;
using Sdl.Web.Common.Logging;
using Sdl.Tridion.Api.Client.ContentModel;
using System.Text;

namespace Sdl.Web.Modules.Search.Controllers
{
    public class TridionDocsSearchController : BaseController
    {
        private static readonly string DEFAULT_DYNAMIC_FIELD_NAME = "dynamic";
        private static readonly string DEFAULT_CONTENT_FIELD_NAME = "content";
        private static readonly string DEFAULT_SEPARATOR = "+"; // used to be .
        private static readonly string DEFAULT_LANGUAGE = "english";
        private static readonly string PUBLICATION_ONLINE_STATUS_VALUE = "VDITADLVRREMOTESTATUSONLINE";
        private static readonly Regex RegexpDoubleQuotes = new Regex("^\"(.*)\"$", RegexOptions.Compiled);
        private static readonly HashSet<string> Cjk = new HashSet<string> { "chinese", "japanese", "korean" };
        private readonly string _separator = DEFAULT_SEPARATOR;
        private readonly string _namespace;
        private readonly string _defaultLanguage = DEFAULT_LANGUAGE;
        private readonly string _defaultDynamicFieldName = DEFAULT_DYNAMIC_FIELD_NAME;
        private readonly string _defaultContentFieldName = DEFAULT_CONTENT_FIELD_NAME;
        private readonly bool _useIqService = false;
        private string PublicationOnlineStatusField => $"{_defaultDynamicFieldName}{_separator}FISHDITADLVRREMOTESTATUS.lng.element";
        private string ContentField(string language) => $"{_defaultContentFieldName}{_separator}{language}";

        public TridionDocsSearchController()
        {
            try
            {
                _useIqService = WebConfigurationManager.AppSettings["iq-service-enabled"] != null && "true".Equals(WebConfigurationManager.AppSettings["iq-service-enabled"], StringComparison.OrdinalIgnoreCase);               
                _separator = WebConfigurationManager.AppSettings["iq-field-separator"] ?? DEFAULT_SEPARATOR;
                _defaultLanguage = WebConfigurationManager.AppSettings["iq-default-language"] ?? DEFAULT_LANGUAGE;
                _defaultContentFieldName = WebConfigurationManager.AppSettings["iq-default-content-field"] ?? DEFAULT_CONTENT_FIELD_NAME;
                _defaultDynamicFieldName = WebConfigurationManager.AppSettings["iq-default-dynamic-field"] ?? DEFAULT_DYNAMIC_FIELD_NAME;
                // if iq-namespace not specified in configuration it will be null and namespace will not be included in iq query (old behavior)
                _namespace = WebConfigurationManager.AppSettings["iq-namespace"];
                Log.Debug($"using IQ query service = {_useIqService}, defaultLanguage = {_defaultLanguage}, separator = {_separator}, contentFieldName = {_defaultContentFieldName}, dynamicFieldName = {_defaultDynamicFieldName}");
            }
            catch (Exception e)
            {
                Log.Error(e);
            }
        }

        [Route("~/search/{searchQuery}")]
        [HttpGet]
        // We reply here with 204 indicating that the server has already fulfilled the request and there
        // is no additional content. We can't rerun the query at this point because of how the react UI
        // request is made and we lose all context of the search such as language, etc.
        public ActionResult Search(string searchQuery) => new HttpStatusCodeResult(204);

        [Route("~/api/search")]
        [HttpPost]
        public virtual ActionResult Search()
        {
            try
            {
                var req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json;
                using (var reader = new StreamReader(Request.InputStream))
                    json = reader.ReadToEnd();

                var searchParams = JsonConvert.DeserializeObject<SearchParameters>(json);
                var lang = GetLanguage(searchParams);
                ICriteria criteria = null;
              
                var queryString = GetSearchQueryString(searchParams);
                var pubId = GetPublicationId(searchParams);
               
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
                    var fields = new List<string> { PublicationOnlineStatusField };
                    var values = new List<object> { new DefaultTermValue(PUBLICATION_ONLINE_STATUS_VALUE) };
                    if (pubId != null)
                    {
                        fields.Add("publicationId");
                        values.Add(new DefaultTermValue(pubId));
                    }
                    if (_namespace != null)
                    {
                        fields.Add("namespace");
                        values.Add(new DefaultTermValue(_namespace));
                    }
                    
                    fields.Add(ContentField(GetLanguage(searchParams)));
                    values.Add(new DefaultTermValue(GetSearchQueryString(searchParams)));
                    criteria = new SearchQuery().GroupedAnd(fields, values).Compile();
                }

                if (_useIqService)
                {
                    // Uses IQ query service
                    var search = ApiClientFactory.Instance.CreateSearchClient<IqSearchResultSet, IqSearchResult>();
                    var results = search.WithResultFilter(new SearchResultFilter
                    {
                        StartOfRange = searchParams.StartIndex,
                        EndOfRange = searchParams.StartIndex + searchParams.Count,
                        IsHighlightingEnabled = true
                    }).Search(criteria);

                    var resultSet = new IqSearchResultSetWrapped(results)
                    {
                        Hits = results.Hits,
                        Count = searchParams.Count.Value,
                        StartIndex = searchParams.StartIndex.Value
                    };
                    return Json(resultSet);
                }
                else
                {
                    // Uses graphql search api
                    var client = ApiClientFactory.Instance.CreateClient();
                    var after = searchParams.StartIndex.HasValue ? Convert.ToBase64String(Encoding.ASCII.GetBytes($"{searchParams.StartIndex.Value}")) : null;
                    var results = client.SearchByRawCriteria(criteria.RawQuery, new InputResultFilter { HighlightingIsEnabled = true },
                        new Pagination
                        {
                            First = searchParams.Count ?? -1,
                            After = after
                        });

                    var resultSet = BuildResultSet(results);
                    resultSet.Count = searchParams.Count.Value;
                    resultSet.StartIndex = searchParams.StartIndex.Value;
                    return Json(resultSet);
                }
            }
            catch (Exception e)
            {
                Log.Debug("Failed to execute search", e);
                Response.StatusCode = 405;
                return new EmptyResult();
            }
        }

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
                    Meta = result.Node.Search.Fields,
                    Highlighted = result.Node.Search.Highlighted
                };

                searchResultSet.QueryResults.Add(searchResult);
                
            }
            return searchResultSet;
        }
        
        private ICriteria CompileMultiLangQuery(string language, string queryString) =>
            new SearchQuery()
                .Field(PublicationOnlineStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                .And()
                .GroupStart()
                .Field(ContentField("cjk"), queryString)
                .Or()
                .Field(ContentField(language), queryString)
                .GroupEnd()
                .Compile();

        private ICriteria CompileMultiLangQuery(string fieldName, object fieldValue, string language, string queryString) =>
            new SearchQuery()
                .GroupStart()
                .Field(PublicationOnlineStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                .And()
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
                .Field(PublicationOnlineStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                .And()
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

        private string GetPublicationId(SearchParameters searchParameters) 
            => searchParameters.PublicationId?.ToString();

        private string GetLanguage(SearchParameters searchParameters) => string.IsNullOrEmpty(searchParameters.Language) ? _defaultLanguage : CultureInfo.GetCultureInfo(searchParameters.Language.Split('-')[0]).EnglishName.ToLower();

        private static string GetSearchQueryString(SearchParameters searchParameters)
        {
            // perform escaping if required
            string searchQuery = searchParameters.SearchQuery;
            Match match = RegexpDoubleQuotes.Match(searchQuery);
            if (match.Success)
            {
                searchQuery = match.Groups[1].Value;
            }
            return searchQuery;
        }
    }
}
