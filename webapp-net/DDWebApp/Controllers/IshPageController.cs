using System;
using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Mvc;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.DDWebApp.Controllers
{
    /// <summary>
    /// Ish Page Controller
    /// </summary>
    public class IshPageController : BaseController
    {
        [Route("~/")]
        [Route("~/home")]
        [Route("~/publications/{*content}")]
        public ActionResult Home()
        {
            return View("Home");
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
            SetupLocalization(publicationId);
            return View("Home");
        }

        protected ActionResult GetPage(int publicationId, int pageId)
        {
            ILocalization localization = SetupLocalization(publicationId);
            using (new Tracer(publicationId, pageId))
            {
                try
                {                 
                    bool addIncludes = true;
                    object addIncludesViewData;
                    if (ViewData.TryGetValue(DxaViewDataItems.AddIncludes, out addIncludesViewData))
                    {
                        addIncludes = (bool)addIncludesViewData;
                    }
                    PageModel pageModel = null;
                    try
                    {
                        pageModel = IshContentProvider.GetPageModel(pageId, localization);
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
