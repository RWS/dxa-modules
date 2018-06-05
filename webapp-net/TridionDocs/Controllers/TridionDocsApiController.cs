using System;
using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Common.Models;
using Sdl.Web.Delivery.ServicesCore.ClaimStore;
using Sdl.Web.Modules.TridionDocs.Providers;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Formats;
using System.Text;
using Sdl.Web.Common.Logging;

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
                return ServerError(ex);
            }
        }

        [Route("~/api/page/{publicationId:int}/{pageId:int}/{*conditions}")]
        [HttpPost]
        public virtual ActionResult Page(int publicationId, int pageId, string conditions)
        {
            try
            {
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

        [Route("~/api/publications")]
        [HttpGet]
        public virtual ActionResult Publications()
        {
            try
            {
                PublicationProvider provider = new PublicationProvider();
                return Json(provider.PublicationList);
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

        public ActionResult ServerError(Exception ex)
        {
            Response.StatusCode = 404;
            if (ex.InnerException != null) ex = ex.InnerException;
            return Content("{ \"Message\": \"" + ex.Message + "\" }", "application/json");
        }
    }
}
