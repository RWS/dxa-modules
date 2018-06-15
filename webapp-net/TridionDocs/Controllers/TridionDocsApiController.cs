using System;
using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Common.Models;
using Sdl.Web.Delivery.ServicesCore.ClaimStore;
using Sdl.Web.Modules.TridionDocs.Providers;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Formats;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Sdl.Web.Common.Logging;
using Sdl.Web.Modules.TridionDocs.Exceptions;

namespace Sdl.Web.Modules.TridionDocs.Controllers
{
    /// <summary>
    /// TridionDocs Api Controller
    /// </summary>
    public class TridionDocsApiController : BaseController
    {
        private static readonly Uri UserConditionsUri = new Uri("taf:ish:userconditions");
     
        [Route("~/api/page/{publicationId:int}/{pageId:int}")]
        [HttpGet]
        public virtual ActionResult Page(int publicationId, int pageId)
        {
            try
            {
                PageModel model = TridionDocsContentProvider.GetPageModel(pageId, SetupLocalization(publicationId));
                WebRequestContext.PageModel = model;
                return Json(model);
            }
            catch(Exception ex)
            {
                Log.Error(ex);
                return ServerError(new TridionDocsApiException($"Page not found: [{publicationId}] {pageId}/index.html"));
            }
        }

        [Route("~/api/page/{publicationId}/{pageId}")]
        [HttpGet]
        public virtual ActionResult Page(string publicationId, string pageId)
        {
            return ServerError(new TridionDocsApiException($"Page not found: [{publicationId}] {pageId}/index.html"), 400);
        }

        [Route("~/api/page/{publicationId:int}/{pageId:int}/{*content}")]
        [HttpPost]
        public virtual ActionResult Page(int publicationId, int pageId, string content)
        {
            try
            {
                string conditions = Request.QueryString["conditions"];
                if (!string.IsNullOrEmpty(conditions))
                {
                    AmbientDataContext.CurrentClaimStore.Put(UserConditionsUri, conditions);
                }
                PageModel model = TridionDocsContentProvider.GetPageModel(pageId, SetupLocalization(publicationId));
                WebRequestContext.PageModel = model;
                return Json(model);
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                return ServerError(ex);
            }
        }

        [Route("~/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [Route("~/api/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [HttpGet]
        [FormatData]
        public virtual ActionResult Binary(int publicationId, int binaryId)
        {
            try
            {
                StaticContentItem content = TridionDocsContentProvider.GetStaticContentItem(binaryId,
                    SetupLocalization(publicationId));
                return new FileStreamResult(content.GetContentStream(), content.ContentType);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/binary/{publicationId}/{binaryId}")]
        [Route("~/api/binary/{publicationId}/{binaryId}")]
        [HttpGet]
        [FormatData]
        public virtual ActionResult Binary(string publicationId, string binaryId)
        {
            return ServerError(null, 400);
        }

        [Route("~/api/publications")]
        [HttpGet]
        public virtual ActionResult Publications()
        {
            try
            {
                PublicationProvider provider = new PublicationProvider();
                return JsonResult(provider.PublicationList);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/conditions/{publicationId:int}")]
        public virtual ActionResult Conditions(int publicationId)
        {
            try
            {
                return new ContentResult
                {
                    ContentType = "application/json",
                    Content = new ConditionProvider().GetConditions(publicationId),
                    ContentEncoding = Encoding.UTF8
                };
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/sitemap.xml")]
        public virtual ActionResult SitemapXml()
        {
            // Use the common SiteMapXml view for rendering out the xml of all the sitemap items.
            return View("SiteMapXml", TridionDocsNavigationProvider.SiteMap);
        }

        [Route("~/api/toc/{publicationId:int}")]
        public virtual ActionResult RootToc(int publicationId, string conditions = "")
        {
            try
            {
                SetupLocalization(publicationId);
                if (!string.IsNullOrEmpty(conditions))
                {
                    AmbientDataContext.CurrentClaimStore.Put(UserConditionsUri, conditions);
                }
                TocProvider tocProvider = new TocProvider();
                return Json(tocProvider.GetToc(publicationId));
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/toc/{publicationId:int}/{sitemapItemId}")]
        public virtual ActionResult Toc(int publicationId, string sitemapItemId, string conditions = "",
            bool includeAncestors = false)
        {
            try
            {
                SetupLocalization(publicationId);
                if (!string.IsNullOrEmpty(conditions))
                {
                    AmbientDataContext.CurrentClaimStore.Put(UserConditionsUri, conditions);
                }
                TocProvider tocProvider = new TocProvider();
                var sitemapItems = tocProvider.GetToc(publicationId, sitemapItemId, includeAncestors);
                return Json(sitemapItems);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/toc/{publicationId}/{sitemapItemId}")]
        public virtual ActionResult Toc(string publicationId, string sitemapItemId)
        {
            return ServerError(null, 400);
        }

        [Route("~/api/pageIdByReference/{publicationId:int}/{ishFieldValue}")]
        public virtual ActionResult TopicIdInTargetPublication(int publicationId, string ishFieldValue)
        {
            try
            {
                SetupLocalization(publicationId);
                if (!string.IsNullOrEmpty(ishFieldValue))
                {
                    throw new DxaItemNotFoundException(
                        "Unable to use empty 'ishlogicalref.object.id' value as a search criteria.");
                }
                return Json(TridionDocsContentProvider.GetPageIdByIshLogicalReference(publicationId, ishFieldValue));
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        public ActionResult ServerError(Exception ex, int statusCode = 404)
        {
            Response.StatusCode = statusCode;
            if(ex == null) return new EmptyResult();
            if (ex.InnerException != null) ex = ex.InnerException;
            return Content("{ \"Message\": \"" + ex.Message + "\" }", "application/json");
        }

        private ContentResult JsonResult(object result)
        {
            return new ContentResult
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(result, new IsoDateTimeConverter() { DateTimeFormat = "yyyy-MM-ddThh:mm:ssZ" }),
                ContentEncoding = Encoding.UTF8
            };
        }
    }
}
