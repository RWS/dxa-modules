using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sdl.Web.Modules.AudienceManager.Models
{
    /// <summary>
    /// CurrentUserWidget entity
    /// </summary>
    public class CurrentUserWidget : EntityModel
    {
        public bool IsLoggedIn
        {
            get
            {
                return UserProfileFactory.CurrentLoggedInUser != null;
            }
        }

        public string UserName
        {
            get
            {
                return UserProfileFactory.CurrentLoggedInUser.UserName;
            }
        }

        public Link LoginLink { get; set; }

        public Link EditProfileLink { get; set; }

        public string LogoutLabel { get; set; }
    }
}