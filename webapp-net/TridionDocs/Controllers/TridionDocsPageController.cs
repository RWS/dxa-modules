using System;
using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.TridionDocs.Controllers
{
    /// <summary>
    /// TridionDocs Page Controller
    /// </summary>
    public class TridionDocsPageController : BaseController
    {
        [Route("~/")]
        [Route("~/home")]
        [Route("~/publications/{*content}")]
        public ActionResult Home()
        {
            System.Web.HttpContext.Current.Items["ActiveFeatures"] = "commenting";
            return View("GeneralPage");
        }

        [Route("~/{publicationId:int}")]
        public virtual ActionResult Page(int publicationId)
        {
            return GetPage(publicationId);
        }

        [Route("~/{publicationId:int}/{pageId:int}")]
        [Route("~/{publicationId:int}/{pageId:int}/{*path}")]
        public virtual ActionResult Page(int publicationId, int pageId, string path = "")
        {
            return GetPage(publicationId, pageId);
        }

        protected ActionResult GetPage(int publicationId)
        {
            System.Web.HttpContext.Current.Items["ActiveFeatures"] = "commenting";
            SetupLocalization(publicationId);
            return View("GeneralPage");
        }

        protected ActionResult GetPage(int publicationId, int pageId)
        {
            ILocalization localization = SetupLocalization(publicationId);
            using (new Tracer(publicationId, pageId))
            {
                try
                {                                   
                    PageModel pageModel;
                    try
                    {
                        pageModel = TridionDocsContentProvider.GetPageModel(pageId, localization);
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
    }
}
