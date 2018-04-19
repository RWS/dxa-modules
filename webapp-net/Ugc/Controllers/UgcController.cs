using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Sdl.Web.Mvc.Controllers;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ugc.Data;
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
                var ugcService = new UgcService();
                var comments = ugcService.GetComments(model.Target.PublicationId, model.Target.ItemId, false, new int[] { }, 0, 0);
                model.Comments = CreateEntities(comments);
                return model;
            }
            
            UgcPostCommentForm postForm = base.EnrichModel(sourceModel) as UgcPostCommentForm;
            if (postForm != null && MapRequestFormData(postForm) && ModelState.IsValid)
            {
                var ugcService = new UgcService();
                ugcService.PostComment(postForm.Target.PublicationId, postForm.Target.ItemId, postForm.UserName, postForm.EmailAddress, postForm.Content, postForm.ParentId, postForm.Metadata);
                return new RedirectModel(WebRequestContext.RequestUrl);
            }

            return sourceModel;
        }

        private static List<UgcComment> CreateEntities(List<Comment> comments) => comments.Select(CreateEntity).ToList();

        private static UgcComment CreateEntity(Comment comment) => new UgcComment {Comments = CreateEntities(comment.Children), CommentData = comment};
    }
}
