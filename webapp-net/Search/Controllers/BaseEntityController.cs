using System.Web.Mvc;
using Sdl.Web.Common.Models;
using Sdl.Web.Mvc.Controllers;

namespace Sdl.Web.Modules.Search.Controllers
{
    public abstract class BaseEntityController : BaseController
    {
        // TODO should be in the framework
        [HandleSectionError(View = "SectionError")]
        public virtual ActionResult Entity(EntityModel entity, int containerSize = 0)
        {
            SetupViewData(entity, containerSize);
            EntityModel model = (EnrichModel(entity) as EntityModel) ?? entity;
            return View(model.MvcData.ViewName, model);
        }        
    }
}