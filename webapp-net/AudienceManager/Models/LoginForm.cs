using Sdl.Web.Common.Models;
using System.ComponentModel.DataAnnotations;

namespace Sdl.Web.Modules.AudienceManager.Models
{
    /// <summary>
    /// LoginForm entity
    /// </summary>
    public class LoginForm : EntityModel
    {
        /// <summary>
        /// Holds the form control value for username
        /// </summary>
        [Required(ErrorMessage = "@Model.NoUserNameMessage")]
        [SemanticProperty(IgnoreMapping=true)]
        public string UserName { get; set; }

        /// <summary>
        /// Holds the form control value for password
        /// </summary>
        [Required(ErrorMessage = "@Model.NoPasswordMessage")]
        [SemanticProperty(IgnoreMapping = true)]
        public string Password { get; set; }

        /// <summary>
        /// Holds the form control value for remember me
        /// </summary>
        [SemanticProperty(IgnoreMapping = true)]
        public bool RememberMe { get; set; }

        /// <summary>
        /// Form heading text
        /// </summary>
        public string Heading { get; set; }

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
        /// User name not specified message
        /// </summary>
        public string NoUserNameMessage { get; set; }

        /// <summary>
        /// Password not specified message
        /// </summary>
        public string NoPasswordMessage { get; set; }

        /// <summary>
        /// Authentication error message
        /// </summary>
        public string AuthenticationErrorMessage { get; set; }
    }
}