using Sdl.Web.Tridion.ContentManager;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Delivery.UGC;
using Sdl.Web.Delivery.UGC.Model;
using Sdl.Web.Modules.Ugc.Data;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Ugc
{
    /// <summary>
    /// Ugc Service
    /// </summary>
    public class UgcService
    {
        private static readonly int MaximumThreadsDepth = -1;
        private readonly IUgcCommentsApi _api;

        public UgcService()
        {
            _api = UgcInstanceProvider.Instance.UgcCommunityClient();
        }     

        public List<Comment> GetComments(int publicationId, int pageId, bool descending, int[] status, int top, int skip)
        {          
            SimpleCommentsFilter filter = new SimpleCommentsFilter
            {
                Top = top,
                Skip = skip,
                Depth = MaximumThreadsDepth,
                Statuses = new List<Status>(new List<int>(status).Select(x => (Status)x))
            };         
            return Convert(_api.RetrieveFlatComments(CreateUri(publicationId, pageId), filter, descending, false));
        }
      
        public Comment PostComment(int publicationId, int pageId, string username, string email, string content,
                              int parentId, Dictionary<string, string> metadata) 
            => Convert(_api.PostComment(CreateUri(publicationId, pageId), username, email, content, parentId, metadata).Result);

        private static CmUri CreateUri(int publicationId, int pageId)
        {
            ILocalization localization = WebRequestContext.Localization;
            return CmUri.Create(localization.CmUriScheme, publicationId, pageId, ItemType.Page);
        }

        private static List<Comment> Convert(IEnumerable<IComment> comments) 
            => comments?.Select(Convert).ToList();

        private static Comment Convert(IComment comment)
        {
            Comment c = new Comment
            {
                Id = comment.Id,
                ItemId = comment.ItemId,
                ItemType = comment.ItemType,
                ItemPublicationId = comment.ItemPublicationId,
                Content = comment.Content
            };

            if (comment.User != null)
            {
                c.User = Convert(comment.User);
            }

            if (comment.CreationDate.HasValue)
            {
                c.CreationDate = comment.CreationDate.Value;
            }

            if (comment.LastModifiedDate.HasValue)
            {
                c.LastModifiedDate = comment.LastModifiedDate.Value;
            }

            c.Children = Convert(comment.Children);
            return c;
        }

        private static User Convert(IUser user) => new User
        {
            Id = user.Id,
            ExternalId = user.ExternalId,
            Name = user.Name,
            EmailAddress = user.EmailAddress,
        };
    }
}
