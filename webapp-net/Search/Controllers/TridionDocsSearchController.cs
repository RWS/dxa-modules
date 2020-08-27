using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sdl.Web.Modules.Search.Data;
using Sdl.Web.Mvc.Controllers;
using System.Text.RegularExpressions;
using Sdl.Tridion.Api.IqQuery;
using Sdl.Tridion.Api.IqQuery.Model.Field;
using Sdl.Tridion.Api.IqQuery.Model.Result;
using Sdl.Web.Tridion.ApiClient;
using Sdl.Tridion.Api.IqQuery.Model.Search;

namespace Sdl.Web.Modules.Search.Controllers
{
    public class TridionDocsSearchController : BaseController
    {
        private static readonly string SEPARATOR = "+";
        private static readonly string PUBLICATION_ONLINE_STATUS_FIELD = $"dynamic{SEPARATOR}FISHDITADLVRREMOTESTATUS.lng.element";
        private static readonly string PUBLICATION_ONLINE_STATUS_VALUE = "VDITADLVRREMOTESTATUSONLINE";
        private static readonly Regex RegexpDoubleQuotes = new Regex("^\"(.*)\"$", RegexOptions.Compiled);
        private static readonly HashSet<string> cjk = new HashSet<string> { "chinese", "japanese", "korean" };

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

                SearchParameters searchParams = JsonConvert.DeserializeObject<SearchParameters>(json);
                string lang = GetLanguage(searchParams);
                ICriteria criteria;
                if (cjk.Contains(lang))
                {                    
                    string queryString = GetSearchQueryString(searchParams);
                    string pubId = GetPublicationId(searchParams);
                    if (pubId != null)
                    {
                        var q = new SearchQuery().GroupStart()
                            .Field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                            .And().Field("publicationId", new DefaultTermValue(pubId))
                            .GroupEnd()
                            .And()
                            .GroupStart()
                            .Field($"content{SEPARATOR}cjk", queryString)
                            .Or()
                            .Field($"content{SEPARATOR}{lang}", queryString)
                            .GroupEnd();
                        criteria = q.Compile();
                    }
                    else
                    {
                        var q = new SearchQuery().GroupStart()
                            .Field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                            .GroupEnd()
                            .And()
                            .GroupStart()
                            .Field($"content{SEPARATOR}cjk", queryString)
                            .Or()
                            .Field($"content{SEPARATOR}{lang}", queryString)
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
            AddQueryField(queryFieldsPair, PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE);
            SetSearchQuery(queryFieldsPair, searchParameters);
            return new SearchQuery().GroupedAnd(queryFieldsPair.Item1, queryFieldsPair.Item2).Compile();
        }
     
        private void SetPublicationIdField(Tuple<List<string>, List<object>> queryFieldsPair, SearchParameters searchParameters)
        {
            var pubId = GetPublicationId(searchParameters);
            if (pubId != null)
            {
                AddQueryField(queryFieldsPair, "publicationId", searchParameters.PublicationId.Value.ToString());
            }
        }

        private void SetSearchQuery(Tuple<List<string>, List<object>> queryFieldsPair, SearchParameters searchParameters) =>
            AddQueryField(queryFieldsPair, $"content{SEPARATOR}{GetLanguage(searchParameters)}", 
                GetSearchQueryString(searchParameters));

        private void AddQueryField(Tuple<List<string>, List<object>> queryFieldsPair, string fieldName, object fieldValue)
        {
            queryFieldsPair.Item1.Add(fieldName);
            queryFieldsPair.Item2.Add(new DefaultTermValue(fieldValue));
        }

        private string GetPublicationId(SearchParameters searchParameters) 
            => searchParameters.PublicationId?.ToString();

        private string GetLanguage(SearchParameters searchParameters)
        {
            var langCode = searchParameters.Language.Split('-')[0];
            return CultureInfo.GetCultureInfo(langCode).EnglishName.ToLower();
        }

        private string GetSearchQueryString(SearchParameters searchParameters)
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

        private Tuple<List<string>, List<object>> CreateQueryFieldsPair()
         => new Tuple<List<string>, List<object>>(new List<string>(), new List<object>());
    }
}
