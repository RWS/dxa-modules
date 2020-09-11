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

namespace Sdl.Web.Modules.Search.Controllers
{
    public class TridionDocsSearchController : BaseController
    {
        private static readonly string DEFAULT_SEPARATOR = "+"; // used to be .
        private static readonly string PUBLICATION_ONLINE_STATUS_VALUE = "VDITADLVRREMOTESTATUSONLINE";
        private static readonly Regex RegexpDoubleQuotes = new Regex("^\"(.*)\"$", RegexOptions.Compiled);
        private static readonly HashSet<string> Cjk = new HashSet<string> { "chinese", "japanese", "korean" };
        private readonly string _separator;
        private string PublicationOnlineStatusField => $"dynamic{_separator}FISHDITADLVRREMOTESTATUS.lng.element";
        private string ContentField(string language) => $"content{_separator}{language}";

        public TridionDocsSearchController()
        {
            try
            {
                _separator = WebConfigurationManager.AppSettings["iq-field-separator"] ?? DEFAULT_SEPARATOR;
            }
            catch (Exception e)
            {
                Log.Error(e);
                _separator = DEFAULT_SEPARATOR;
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
                ICriteria criteria;
                if (Cjk.Contains(lang))
                {                    
                    var queryString = GetSearchQueryString(searchParams);
                    var pubId = GetPublicationId(searchParams);
                    if (pubId != null)
                    {
                        var q = new SearchQuery().GroupStart()
                            .Field(PublicationOnlineStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                            .And().Field("publicationId", new DefaultTermValue(pubId))
                            .GroupEnd()
                            .And()
                            .GroupStart()
                            .Field(ContentField("cjk"), queryString)
                            .Or()
                            .Field(ContentField(lang), queryString)
                            .GroupEnd();
                        criteria = q.Compile();
                    }
                    else
                    {
                        var q = new SearchQuery().GroupStart()
                            .Field(PublicationOnlineStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                            .GroupEnd()
                            .And()
                            .GroupStart()
                            .Field(ContentField("cjk"), queryString)
                            .Or()
                            .Field(ContentField(lang), queryString)
                            .GroupEnd();
                        criteria = q.Compile();
                    }
                }
                else
                    criteria = SingleLanguageSearchQuery(searchParams);

                var search = ApiClientFactory.Instance.CreateSearchClient<SearchResultSet, SearchResult>();            
                var results = search.WithResultFilter(new SearchResultFilter
                {
                    StartOfRange = searchParams.StartIndex,
                    EndOfRange = searchParams.StartIndex + searchParams.Count,
                    IsHighlightingEnabled = true
                }).Search(criteria);

                var resultSet = new SearchResultSetWrapped(results)
                {
                    Hits = results.Hits,
                    Count = searchParams.Count.Value,
                    StartIndex = searchParams.StartIndex.Value
                };
                return Json(resultSet);
            }
            catch (Exception)
            {
                Response.StatusCode = 405;
                return new EmptyResult();
            }
        }

        private ICriteria SingleLanguageSearchQuery(SearchParameters searchParameters)
        {
            var queryFieldsPair = CreateQueryFieldsPair();
            SetPublicationIdField(queryFieldsPair, searchParameters);
            AddQueryField(queryFieldsPair, PublicationOnlineStatusField, PUBLICATION_ONLINE_STATUS_VALUE);
            SetSearchQuery(queryFieldsPair, searchParameters);
            return new SearchQuery().GroupedAnd(queryFieldsPair.Item1, queryFieldsPair.Item2).Compile();
        }
     
        private void SetPublicationIdField(Tuple<List<string>, List<object>> queryFieldsPair, SearchParameters searchParameters)
        {
            var pubId = GetPublicationId(searchParameters);
            if (pubId == null) return;
            AddQueryField(queryFieldsPair, "publicationId", searchParameters.PublicationId.Value.ToString());
        }

        private void SetSearchQuery(Tuple<List<string>, List<object>> queryFieldsPair, SearchParameters searchParameters) =>
            AddQueryField(queryFieldsPair, ContentField(GetLanguage(searchParameters)), 
                GetSearchQueryString(searchParameters));

        private static void AddQueryField(Tuple<List<string>, List<object>> queryFieldsPair, string fieldName, object fieldValue)
        {
            queryFieldsPair.Item1.Add(fieldName);
            queryFieldsPair.Item2.Add(new DefaultTermValue(fieldValue));
        }

        private string GetPublicationId(SearchParameters searchParameters) 
            => searchParameters.PublicationId?.ToString();

        private string GetLanguage(SearchParameters searchParameters) 
            => CultureInfo.GetCultureInfo(searchParameters.Language.Split('-')[0]).EnglishName.ToLower();

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

        private static Tuple<List<string>, List<object>> CreateQueryFieldsPair()
            => new Tuple<List<string>, List<object>>(new List<string>(), new List<object>());
    }
}
