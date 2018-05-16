using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sdl.Web.Delivery.IQQuery.API;
using Sdl.Web.Delivery.IQQuery.Client;
using Sdl.Web.Delivery.IQQuery.Model.Field;
using Sdl.Web.Delivery.IQQuery.Model.Result;
using Sdl.Web.Modules.Search.Data;
using Sdl.Web.Mvc.Controllers;

namespace Sdl.Web.Modules.Search.Controllers
{
    public class TridionDocsSearchController : BaseController
    {
        [Route("~/api/search")]
        [HttpPost]
        public virtual ActionResult Search()
        {
            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();

            SearchParameters searchParams = JsonConvert.DeserializeObject<SearchParameters>(json);
            
            IQSearchClient<SearchResultSet, SearchResult> search = new IQSearchClient<SearchResultSet, SearchResult>();
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
            values.Add(new DefaultTermValue(searchParams.SearchQuery, TermTypes.Exact));
            var results = search.WithResultFilter(new SearchResultFilter
            {
                StartOfRange = searchParams.StartIndex,
                EndOfRange = searchParams.StartIndex + searchParams.Count,
                IsHighlightingEnabled = true
            }).Search(new Delivery.IQQuery.Model.Search.SearchQuery().GroupedAnd(fields, values).Compile());        
            return Json(new SearchResultSetWrapped(results));
        }      
    }
}
