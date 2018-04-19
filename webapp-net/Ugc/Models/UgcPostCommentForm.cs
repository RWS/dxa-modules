using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Sdl.Web.Common;
using Sdl.Web.Common.Models;
using Sdl.Web.Tridion.ContentManager;

namespace Sdl.Web.Modules.Ugc.Models
{
    [Serializable]
    [DxaNoOutputCache]
    public class UgcPostCommentForm : EntityModel
    {
        /// <summary>
        /// Holds the form control value for username
        /// </summary>
        [Required(ErrorMessage = "@Model.NoUserNameMessage")]
        [SemanticProperty(IgnoreMapping = true)]
        public string UserName { get; set; }

        /// <summary>
        /// Holds the form control value for email address
        /// </summary>
        [Required(ErrorMessage = "@Model.NoEmailAddressMessage")]
        [SemanticProperty(IgnoreMapping = true)]
        public string EmailAddress { get; set; }

        /// <summary>
        /// Holds the form control value for email address
        /// </summary>
        [Required(ErrorMessage = "@Model.NoContentMessage")]
        [SemanticProperty(IgnoreMapping = true)]
        public string Content { get; set; }

        /// <summary>
        /// Metadata of comment to post
        /// </summary>
        [SemanticProperty(IgnoreMapping = true)]
        public Dictionary<string,string> Metadata { get; set; }

        /// <summary>
        /// Parent id of comment to post
        /// </summary>
        [SemanticProperty(IgnoreMapping = true)]
        public int ParentId { get; set; } = 0;

        /// <summary>
        /// Label text for username input control on view
        /// </summary>
        public string UserNameLabel { get; set; }

        /// <summary>
        /// Label text for email address input control on view
        /// </summary>
        public string EmailAddressLabel { get; set; }

        /// <summary>
        /// Label text for content input control on view
        /// </summary>
        public string ContentLabel { get; set; }

        /// <summary>
        /// Label text for submit botton on view
        /// </summary>
        public string SubmitButtonLabel { get; set; }

        /// <summary>
        /// User name not specified message
        /// </summary>
        public string NoUserNameMessage { get; set; }

        /// <summary>
        /// Email not specified message
        /// </summary>
        public string NoEmailAddressMessage { get; set; }

        /// <summary>
        /// Content not specified message
        /// </summary>
        public string NoContentMessage { get; set; }

        /// <summary>
        /// Target CmUri for comments
        /// </summary>
        [SemanticProperty(IgnoreMapping = true)]
        public CmUri Target { get; set; }
    }
}
