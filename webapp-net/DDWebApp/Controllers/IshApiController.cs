﻿using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.DDWebApp.Providers;
using Sdl.Web.Mvc.Formats;

namespace Sdl.Web.Modules.DDWebApp.Controllers
{
    /// <summary>
    /// Ish Api Controller
    /// </summary>
    public class IshApiController : BaseController
    {
        [Route("~/api/page/{publicationId:int}/{pageId:int}")]
        [Route("~/api/page/{publicationId:int}/{pageId:int}/{*path}")]
        [HttpGet]
        [FormatData]
        public virtual ActionResult Page(int publicationId, int pageId, string path, string conditions = "")
        {
            PageModel pageModel = IshContentProvider.GetPageModel(pageId, SetupLocalization(publicationId));
            return Json(pageModel);
            //return Content(JsonConvert.SerializeObject(pageModel), "application/json");
        }

        [Route("~/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [Route("~/api/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [HttpGet]
        [FormatData]
        public virtual ActionResult Binary(int publicationId, int binaryId)
        {
            StaticContentItem content = IshContentProvider.GetStaticContentItem(binaryId, SetupLocalization(publicationId));
            return new FileStreamResult(content.GetContentStream(), content.ContentType);
        }

        [Route("~/api/publications")]
        [HttpGet]
        public virtual ActionResult Publications()
        {
            PublicationProvider provider = new PublicationProvider();
            return Json(provider.PublicationList);
        }

        [Route("~/api/conditions/{publicationId:int}")]
        public virtual ActionResult Conditions(int publicationId)
        {
            return Json(new ConditionProvider().GetConditions(publicationId));
        }

        [Route("~/api/sitemap.xml")]
        public virtual ActionResult SitemapXml()
        {
            // Use the common SiteMapXml view for rendering out the xml of all the sitemap items.
            return View("SiteMapXml", IshNavigationProvider.SiteMap);
        }

        [Route("~/api/toc/{publicationId:int}")]
        public virtual ActionResult RootToc(int publicationId, string conditions = "")
        {
            SetupLocalization(publicationId);
            if (!string.IsNullOrEmpty(conditions))
            {
                // todo: add claim URI.create("taf:ish:userconditions") with value 'conditions'
            }
            TocProvider tocProvider = new TocProvider();
            return Json(tocProvider.GetToc(publicationId));
        }

        [Route("~/api/toc/{publicationId:int}/{sitemapItemId}")]
        public virtual ActionResult Toc(int publicationId, string sitemapItemId, string conditions = "", bool includeAncestors = false)
        {
            SetupLocalization(publicationId);
            if (!string.IsNullOrEmpty(conditions))
            {
                // todo: add claim URI.create("taf:ish:userconditions") with value 'conditions'
            }
            TocProvider tocProvider = new TocProvider();
            var sitemapItems = tocProvider.GetToc(publicationId, sitemapItemId, includeAncestors);
            return Json(sitemapItems);
        }

        [Route("~/api/pageIdByReference/{publicationId:int}/{ishFieldValue}")]
        public virtual ActionResult TopicIdInTargetPublication(int publicationId, string ishFieldValue)
        {
            SetupLocalization(publicationId);
            if (!string.IsNullOrEmpty(ishFieldValue))
            {
                throw new DxaItemNotFoundException("Unable to use empty 'ishlogicalref.object.id' value as a search criteria.");
            }          
            return Json(IshContentProvider.GetPageIdByIshLogicalReference(publicationId, ishFieldValue));
        }
    }
}
