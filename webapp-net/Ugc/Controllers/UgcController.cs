using System.Collections.Generic;
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
            ILocalization localization = WebRequestContext.Localization;
            int pubId = int.Parse(localization.Id);
            UgcCommentList model = base.EnrichModel(sourceModel) as UgcCommentList;
            if (model != null)
            {
                int pageId = int.Parse(model.Id);
                model.Comments = ugc.GetComments(pubId, pageId, false, new int[] {},
                    0, 0);
                return model;
            }

            UgcPostCommentForm postForm = base.EnrichModel(sourceModel) as UgcPostCommentForm;
            if(postForm != null && MapRequestFormData(postForm) && ModelState.IsValid)
            {
                int pageId = int.Parse(postForm.Id);
                ugc.PostComment(pubId, pageId, postForm.UserName,
                    postForm.EmailAddress, postForm.Content, 0, new Dictionary<string, string>());
                return new RedirectModel(WebRequestContext.RequestUrl);
            }
            return sourceModel;
        }
    }
}
