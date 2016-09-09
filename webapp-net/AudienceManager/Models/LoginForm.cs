using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sdl.Web.Modules.AudienceManager.Models
{
    /// <summary>
    /// LoginForm entity
    /// </summary>
    public class LoginForm : EntityModel
    {
        /// <summary>
        /// Form heading text
        /// </summary>
        public string Heading { get; set; }

        /// <summary>
        /// Holds the form control value for username
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Holds the form control value for password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Holds the form control value for remember me
        /// </summary>
        public bool RememberMe { get; set; }

        /// <summary>
        /// Label text for username input control on view
        /// </summary>
        public string UserNameLabel { get; set; }

        /// <summary>
        /// Label text for password input control on view
        /// </summary>
        public string PasswordLabel { get; set; }

        /// <summary>
        /// Label text for remember me check box on view
        /// </summary>
        public string RememberMeLabel { get; set; }

        /// <summary>
        /// Label text for submit botton on view
        /// </summary>
        public string SubmitButtonLabel { get; set; }

        /// <summary>
        /// Text for sucessfull login on view
        /// </summary>
        public string LoginSuccessText { get; set; }
    }
}