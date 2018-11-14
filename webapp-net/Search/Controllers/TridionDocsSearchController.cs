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

namespace Sdl.Web.Modules.Search.Controllers
{
    public class TridionDocsSearchController : BaseController
    {
        private static readonly Regex RegexpDoubleQuotes = new Regex("^\"(.*)\"$", RegexOptions.Compiled);

        [Route("~/api/search")]
        [HttpPost]
        public virtual ActionResult Search()
        {
            try
            {
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();

                SearchParameters searchParams = JsonConvert.DeserializeObject<SearchParameters>(json);

                var search = ApiClientFactory.Instance.CreateSearchClient<SearchResultSet, SearchResult>();

                search.WithResultFilter(new SearchResultFilter
                {
                    StartOfRange = searchParams.StartIndex,
                    EndOfRange = searchParams.StartIndex + searchParams.Count,
                    IsHighlightingEnabled = true
                });
                var fields = new List<string>();
                var values = new List<object>();
                if (searchParams.PublicationId != null)
                {
                    fields.Add("publicationId");
                    values.Add(new DefaultTermValue(searchParams.PublicationId.Value.ToString()));
                }
                fields.Add("dynamic.FISHDITADLVRREMOTESTATUS.lng.element");
                fields.Add($"content.{CultureInfo.GetCultureInfo(searchParams.Language).EnglishName.ToLower()}");
                values.Add(new DefaultTermValue("VDITADLVRREMOTESTATUSONLINE"));

                string searchQuery = searchParams.SearchQuery;
                Match match = RegexpDoubleQuotes.Match(searchQuery);
                if (match.Success)
                {
                    searchQuery = match.Groups[1].Value;
                }

                values.Add(new DefaultTermValue(searchQuery, TermTypes.Exact));
                var results = search.WithResultFilter(new SearchResultFilter
                {
                    StartOfRange = searchParams.StartIndex,
                    EndOfRange = searchParams.StartIndex + searchParams.Count,
                    IsHighlightingEnabled = true
                }).Search(new Sdl.Tridion.Api.IqQuery.Model.Search.SearchQuery().GroupedAnd(fields, values).Compile());
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
    }
}
