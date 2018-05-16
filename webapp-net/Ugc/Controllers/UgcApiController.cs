using System;
using System.Collections.Generic;
using Sdl.Web.Mvc.Controllers;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Sdl.Web.Modules.Ugc.Data;
using Sdl.Web.Mvc.Configuration;
using Tridion.ContentDelivery.AmbientData;

namespace Sdl.Web.Modules.Ugc.Controllers
{
    /// <summary>
    /// Ugc Api Controller
    /// </summary>
    public class UgcApiController : BaseController
    {      
        [Route("{localization}/api/comments/{pageId:int}")]
        [Route("~/api/comments/{publicationId:int}/{pageId:int}")]
        [HttpGet]
        public ActionResult GetComments(int? publicationId, int pageId, bool descending = false, int[] status = null, int top = 0, int skip = 0)
        {            
            UgcService ugc = new UgcService();          
            var comments = ugc.GetComments(
                publicationId ?? int.Parse(WebRequestContext.Localization.Id),
                pageId, descending, status ?? new int[] {}, top, skip);

            return new ContentResult
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(comments, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }),
                ContentEncoding = Encoding.UTF8
            };
        }

        [Route("~/api/comments/add")]
        [Route("{localization}/api/comments/add")]
        [HttpPost]
        public ActionResult PostComment(int publicationId, int pageId, bool descending = false, int[] status = null, int top = 0, int skip = 0)
        {
            UgcService ugc = new UgcService();
            Stream req = Request.InputStream;
            req.Seek(0, SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();
            PostedComment posted = JsonConvert.DeserializeObject<PostedComment>(json);
            Dictionary<string, string> metadata = new Dictionary<string, string>
            {
                {"publicationTitle", "\""+Regex.Escape(posted.PublicationTitle)+"\""},
                {"publicationUrl", "\""+posted.PublicationUrl+"\""},
                {"itemTitle", "\""+Regex.Escape(posted.PageTitle)+"\""},
                {"itemUrl", "\""+posted.PageUrl+"\""},
                {"language", "\""+posted.Language+"\""},
                {"status", "0"}
            };

            AddPubIdTitleLangToCommentMetadata(posted, metadata);

            string userId = posted.Username;
            if (string.IsNullOrEmpty(userId))
            {
                userId = "Anonymous";
            }

            Comment result = ugc.PostComment(posted.PublicationId,
                    posted.PageId,
                    userId,
                    posted.Email,
                    posted.Content,
                    posted.ParentId,
                    metadata);
            return new ContentResult
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(result, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }),
                ContentEncoding = Encoding.UTF8
            };
        }

        [Route("~/api/comments/upvote")]
        [Route("{localization}/api/comments/upvote")]
        public async Task<ActionResult> UpVoteComment(int commentId)
        {
            UgcService ugc = new UgcService();
            await ugc.UpVoteComment(commentId);
            return Redirect(Request.UrlReferrer?.AbsolutePath);
        }

        [Route("~/api/comments/downvote")]
        [Route("{localization}/api/comments/downvote")]
        public async Task<ActionResult> DownVoteComment(int commentId)
        {
            UgcService ugc = new UgcService();
            await ugc.DownVoteComment(commentId);
            return Redirect(Request.UrlReferrer?.AbsolutePath);
        }

        [Route("~/api/comments/remove")]
        [Route("{localization}/api/comments/remove")]
        public async Task<ActionResult> RemoveComment(int commentId)
        {
            UgcService ugc = new UgcService();
            await ugc.RemoveComment(commentId);
            return Redirect(Request.UrlReferrer?.AbsolutePath);
        }

        private static void AddPubIdTitleLangToCommentMetadata(PostedComment comment, Dictionary<string, string> metadata)
        {
            PubIdTitleLang pubIdTitleLang = new PubIdTitleLang
            {
                Id = comment.PublicationId,
                Lang = comment.Language,
                Title = comment.PublicationTitle
            };
            metadata.Add("pubIdTitleLang", JsonConvert.SerializeObject(pubIdTitleLang));
        }
    }
}
