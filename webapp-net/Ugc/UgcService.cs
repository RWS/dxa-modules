using System;
using Sdl.Web.Tridion.ContentManager;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Delivery.UGC;
using Sdl.Web.Delivery.UGC.Model;
using Sdl.Web.Modules.Ugc.Data;
using Sdl.Web.Mvc.Configuration;
using Tridion.ContentDelivery.AmbientData;

namespace Sdl.Web.Modules.Ugc
{
    /// <summary>
    /// Ugc Service
    /// </summary>
    public class UgcService
    {
        private static readonly int MaximumThreadsDepth = -1;
        private readonly IUgcCommentsApi _api;
        private readonly IUgcVoteCommentApi _votingApi;

        public UgcService()
        {
            _api = UgcInstanceProvider.Instance.UgcCommunityClient();
            _votingApi = (IUgcVoteCommentApi) _api;
        }

        public List<Comment> GetComments(int publicationId, int pageId, bool descending, int[] status, int top, int skip)
        {
            SimpleCommentsFilter filter = new SimpleCommentsFilter
            {
                Top = top,
                Skip = skip,
                Depth = MaximumThreadsDepth,
                Statuses = new List<Status>(new List<int>(status).Select(x => (Status) x))
            };
            return Convert(_api.RetrieveThreadedComments(CreateUri(publicationId, pageId), filter, descending, true));
        }

        public Comment PostComment(int publicationId, int pageId, string username, string email, string content,
            int parentId, Dictionary<string, string> metadata)
        {
            var claimStore = AmbientDataContext.CurrentClaimStore;
            if (claimStore != null)
            {
                claimStore.Put(new Uri("taf:claim:contentdelivery:webservice:user"), username);
                claimStore.Put(new Uri("taf:claim:contentdelivery:webservice:post:allowed"), true);
            }
            return Convert(
                _api.PostComment(CreateUri(publicationId, pageId), username, email, content, parentId, metadata).Result);
        }

        public async Task UpVoteComment(long commentId)
        {
            await _votingApi.VoteCommentUp(commentId);
        }

        public async Task DownVoteComment(long commentId)
        {
            await _votingApi.VoteCommentDown(commentId);
        }

        public async Task<bool> RemoveComment(long commentId)
        {
            return await _api.RemoveComment(commentId);
        }

        private static CmUri CreateUri(int publicationId, int pageId)
        {
            ILocalization localization = WebRequestContext.Localization;
            return CmUri.Create(localization.CmUriScheme, publicationId, pageId, ItemType.Page);
        }

        private static List<Comment> Convert(IEnumerable<IComment> comments)
            => comments?.Select(Convert).ToList();

        private static Comment Convert(IComment comment)
        {
            if (comment == null) return null;
            Comment c = new Comment
            {
                Id = comment.Id,
                ParentId = comment.ParentId,
                ItemId = comment.ItemId,
                ItemType = comment.ItemType,
                ItemPublicationId = comment.ItemPublicationId,
                Content = comment.Content,
                Rating = comment.Score,
                Metadata = Convert(comment.Metadata)
            };

            if (comment.User != null)
            {
                c.User = Convert(comment.User);
            }

            if (comment.CreationDate.HasValue)
            {
                c.CreationDate = Convert(comment.CreationDate.Value);
            }

            if (comment.LastModifiedDate.HasValue)
            {
                c.LastModifiedDate = Convert(comment.LastModifiedDate.Value);
            }

            c.Children = Convert(comment.Children);
            return c;
        }

        private static Dictionary<string, string> Convert(List<ICommentMeta> meta)
        {
            var metadata = new Dictionary<string, string>();
            if (meta == null) return metadata;
            foreach (var m in meta.Where(m => !metadata.ContainsKey(m.KeyName)))
            {
                metadata.Add(m.KeyName, m.KeyValue);
            }
            return metadata;
        }

        private static User Convert(IUser user) => new User
        {
            Id = user.Id,
            ExternalId = user.ExternalId,
            Name = user.Name,
            EmailAddress = user.EmailAddress,
        };

        private static CommentDate Convert(DateTime dt) => new CommentDate
        {
            DateTime = dt,
            DayOfMonth = dt.Month,
            DayOfWeek = dt.DayOfWeek.ToString(),
            DayOfYear = dt.DayOfYear,
            Month = new DateTimeFormatInfo().GetMonthName(dt.Month),
            MonthValue = dt.Month,
            Year = dt.Year,
            Hour = dt.Hour,
            Minute = dt.Minute,
            Second = dt.Second,
            Nano = dt.Millisecond
        };
    }
}
