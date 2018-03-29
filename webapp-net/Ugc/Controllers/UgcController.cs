using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Mvc.Controllers;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ugc.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Ugc.Controllers
{
    /// <summary>
    /// Ugc Controller
    /// </summary>
    public class UgcController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            UgcService ugc = new UgcService();
            UgcCommentList model = base.EnrichModel(sourceModel) as UgcCommentList;
            if(model == null) return sourceModel;

            // TODO: we should get page id
            ILocalization localization = WebRequestContext.Localization;
            model.Comments = ugc.GetComments(5960742, 5960654, false, new int[] {}, 0, 0);

          //  model.Comments = ugc.GetComments(Int32.Parse(localization.Id), int.Parse(model.Id), false, new int[] { }, 0, 0);

            return model;
        }
    }
}
