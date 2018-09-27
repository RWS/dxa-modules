using System;
using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.DynamicDocumentation.Providers;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.DynamicDocumentation.Controllers
{
    /// <summary>
    /// Page Controller
    /// </summary>
    [RouteArea("DynamicDocumentation")]
    public class DynamicDocumentationPageController : Mvc.Controllers.PageController
    {
        [Route("~/")]
        [Route("~/home")]
        [Route("~/publications/{*content}")]
        [HttpGet]
        public ActionResult Home()
        {
            return View("GeneralPage");
        }

        [Route("~/{publicationId:int}")]
        [HttpGet]
        public virtual ActionResult Page(int publicationId)
        {
            return GetPage(publicationId);
        }

        [Route("~/{publicationId:int}/{pageId:int}")]
        [Route("~/{publicationId:int}/{pageId:int}/{*path}")]
        [HttpGet]
        public virtual ActionResult Page(int publicationId, int pageId, string path = "")
        {
            return GetPage(publicationId, pageId);
        }

        protected ActionResult GetPage(int publicationId)
        {
            SetupLocalization(publicationId);
            return View("GeneralPage");
        }

        protected ActionResult GetPage(int publicationId, int pageId)
        {
            using (new Tracer(publicationId, pageId))
            {
                try
                {
                    ILocalization localization = SetupLocalization(publicationId);

                    PageModel pageModel;
                    try
                    {
                        pageModel = ContentProvider.GetPageModel(pageId, localization);
                    }
                    catch (DxaItemNotFoundException ex)
                    {
                        Log.Info(ex.Message);
                        return NotFound();
                    }

                    PageModelWithHttpResponseData pageModelWithHttpResponseData =
                        pageModel as PageModelWithHttpResponseData;
                    pageModelWithHttpResponseData?.SetHttpResponseData(System.Web.HttpContext.Current.Response);
                    SetupViewData(pageModel);
                    PageModel model = (EnrichModel(pageModel) as PageModel) ?? pageModel;
                    WebRequestContext.PageModel = model;
                    return View(model.MvcData.ViewName, model);
                }
                catch (Exception ex)
                {
                    Log.Error(ex);
                    return ServerError();
                }
            }
        }

        public ActionResult ServerError()
        {
            using (new Tracer())
            {
                Response.StatusCode = 404;             
                ViewResult r = View("ErrorPage");
                r.ViewData.Add("statusCode", Response.StatusCode);
                return r;
            }
        }

        protected ILocalization SetupLocalization(int publicationId)
        {
            PublicationProvider provider = new PublicationProvider();
            provider.CheckPublicationOnline(publicationId);
            ILocalization localization = WebRequestContext.Localization;
            localization.Id = publicationId.ToString();
            return localization;
        }
    }
}
