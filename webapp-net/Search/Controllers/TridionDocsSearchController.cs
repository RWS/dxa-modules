using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sdl.Web.Delivery.IQQuery.API;
using Sdl.Web.Delivery.IQQuery.Client;
using Sdl.Web.Delivery.IQQuery.Model.Field;
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

            var results =
                search.Search(
                    new Delivery.IQQuery.Model.Search.SearchQuery().GroupedAnd(
                        new List<string> { "dynamic.FISHDITADLVRREMOTESTATUS.lng.element", "content.english" },
                        new List<object>
                        {
                            new DefaultTermValue("VDITADLVRREMOTESTATUSONLINE"),
                            new DefaultTermValue(searchParams.SearchQuery, TermTypes.Exact)
                        }).Compile());
           
            return Json(new SearchResultSetWrapped(results));
        }
    }
}
