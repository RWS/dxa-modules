using System;
using System.Collections.Generic;
using Sdl.Web.Mvc.Controllers;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Sdl.Web.Modules.Ugc.Data;
using Sdl.Web.Mvc.Configuration;

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
        public ActionResult GetComments(int? publicationId, int pageId, bool descending = false, int[] status = null,
            int top = 0, int skip = 0)
        {
            UgcService ugc = new UgcService();
            var comments = ugc.GetComments(
                publicationId ?? int.Parse(WebRequestContext.Localization.Id),
                pageId, descending, status ?? new int[] {}, top, skip);

            if(comments == null)
                return ServerError(null);
            return new ContentResult
            {
                ContentType = "application/json",
                Content =
                    JsonConvert.SerializeObject(comments,
                        new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()}),
                ContentEncoding = Encoding.UTF8
            };
        }

        [Route("~/api/comments/add")]
        [Route("{localization}/api/comments/add")]
        [HttpPost]
        public ActionResult PostComment(int? publicationId, int? pageId, bool descending = false, int[] status = null,
            int top = 0, int skip = 0)
        {
            try
            {
                Stream req = Request.InputStream;
                req.Seek(0, SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                PostedComment posted = JsonConvert.DeserializeObject<PostedComment>(json);

                if (!posted.ParentId.HasValue || pageId == null || publicationId == null)
                {
                    return ServerError(null);
                }

                UgcService ugc = new UgcService();
                Dictionary<string, string> metadata = CreateMetadata(posted, true);

                string userId = posted.Username;
                if (string.IsNullOrEmpty(userId))
                {
                    userId = "Anonymous";
                }

                Comment result = ugc.PostComment(posted.PublicationId.Value,
                    posted.PageId.Value,
                    userId,
                    posted.Email,
                    posted.Content,
                    posted.ParentId ?? 0,
                    metadata);

                if(result == null)
                    return ServerError(null);
                result.Metadata = CreateMetadata(posted, false);
                return new ContentResult
                {
                    ContentType = "application/json",
                    Content =
                        JsonConvert.SerializeObject(result,
                            new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()}),
                    ContentEncoding = Encoding.UTF8
                };
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/comments/upvote")]
        [Route("{localization}/api/comments/upvote")]
        public ActionResult UpVoteComment(int commentId)
        {
            UgcService ugc = new UgcService();
            ugc.UpVoteComment(commentId);
            return Redirect(Request.UrlReferrer?.AbsolutePath);
        }

        [Route("~/api/comments/downvote")]
        [Route("{localization}/api/comments/downvote")]
        public ActionResult DownVoteComment(int commentId)
        {
            UgcService ugc = new UgcService();
            ugc.DownVoteComment(commentId);
            return Redirect(Request.UrlReferrer?.AbsolutePath);
        }

        [Route("~/api/comments/remove")]
        [Route("{localization}/api/comments/remove")]
        public ActionResult RemoveComment(int commentId)
        {
            UgcService ugc = new UgcService();
            ugc.RemoveComment(commentId);
            return Redirect(Request.UrlReferrer?.AbsolutePath);
        }
     
        private static Dictionary<string, string> CreateMetadata(PostedComment posted, bool escape)
        {
            string pubTitle = posted.PublicationTitle;
            string pubUrl = posted.PublicationUrl;
            string itemTitle = posted.PageTitle;
            string pageUrl = posted.PageUrl;
            string lang = posted.Language;

            if (escape)
            {
                pubTitle = $"\"{Regex.Escape(pubTitle)}\"";
                pubUrl = $"\"{pubUrl}\"";
                pageUrl = $"\"{pageUrl}\"";
                itemTitle = $"\"{itemTitle}\"";
                lang = $"\"{lang}\"";
            }

            var metadata = new Dictionary<string, string>
            {
                {"publicationTitle", pubTitle},
                {"publicationUrl", pubUrl},
                {"itemTitle", itemTitle},
                {"itemUrl", pageUrl},
                {"language", lang},
                {"status", "0"}
            };
            metadata.Add("pubIdTitleLang", $"{{\"id\":{posted.PublicationId},\"title\":\"{posted.PublicationTitle}\",\"lang\":\"{posted.Language}\"}}");
            return metadata;
        }

        public ActionResult ServerError(Exception ex)
        {
            Response.StatusCode = 405;
            if (ex == null)
            {
                return new EmptyResult();
            }
            if (ex.InnerException != null) ex = ex.InnerException;
            return Content("{ \"Message\": \"" + ex.Message + "\" }", "application/json");
        }
    }
}
