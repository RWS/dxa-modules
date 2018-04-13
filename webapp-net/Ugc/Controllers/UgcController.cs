using System.Collections.Generic;
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
            UgcComments model = base.EnrichModel(sourceModel) as UgcComments;
            if (model != null)
            {
                UgcService ugc = new UgcService();
                model.Comments = ugc.GetComments(model.Target.PublicationId, model.Target.ItemId, false, new int[] { }, 0, 0);
                return model;
            }
            
            UgcPostCommentForm postForm = base.EnrichModel(sourceModel) as UgcPostCommentForm;
            if (postForm != null && MapRequestFormData(postForm) && ModelState.IsValid)
            {
                UgcService ugc = new UgcService();
                ugc.PostComment(postForm.Target.PublicationId, postForm.Target.ItemId, postForm.UserName, postForm.EmailAddress, postForm.Content, 0, new Dictionary<string, string>());
                return new RedirectModel(WebRequestContext.RequestUrl);
            }

            return sourceModel;
        }
    }
}
