using Newtonsoft.Json;
using Sdl.Web.Common.Models;
using System;
using Sdl.Web.Common;

namespace Sdl.Web.Modules.AudienceManager.Models
{
    /// <summary>
    /// CurrentUserWidget entity
    /// </summary>
    [Serializable]
    [DxaNoOutputCache]
    public class CurrentUserWidget : EntityModel
    {
        /// <summary>
        /// Returns true if we are currently logged in
        /// </summary>
        [SemanticProperty(IgnoreMapping = true)]
        [JsonIgnore]
        public bool IsLoggedIn => UserProfileFactory.CurrentLoggedInUser != null;

        /// <summary>
        /// UserName of currently logged in user
        /// </summary>
        [SemanticProperty(IgnoreMapping = true)]
        [JsonIgnore]
        public string UserName => UserProfileFactory.CurrentLoggedInUser.UserName;

        /// <summary>
        /// Link to login form
        /// </summary>
        public Link LoginLink { get; set; }

        /// <summary>
        /// Link to edit user profile form
        /// </summary>
        public Link EditProfileLink { get; set; }

        /// <summary>
        /// Label text for login link
        /// </summary>        
        public string LoginLabel { get; set; }

        /// <summary>
        /// Label text for logout link
        /// </summary>
        public string LogoutLabel { get; set; }
    }
}