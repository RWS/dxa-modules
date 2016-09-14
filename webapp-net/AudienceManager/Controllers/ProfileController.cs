using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;
using Tridion.OutboundEmail.ContentDelivery.Profile;
using Sdl.Web.Modules.AudienceManager.Models;

namespace Sdl.Web.Modules.AudienceManager.Controllers
{
    /// <summary>
    /// ProfileController
    /// </summary>
    [RoutePrefix("{localization}/api/profile")]
    public class ProfileController : EntityController
    {
        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        [Route("~/api/profile/login")]
        public ActionResult Login(LoginForm model, string returnUrl)
        {
            // validate the user using the AudienceManager membership provider.
            if (this.ModelState.IsValid && Membership.ValidateUser(model.UserName, model.Password))
            {
                FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);
            }
            if (!string.IsNullOrEmpty(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return Redirect(WebRequestContext.Localization.GetBaseUrl());
            }           
        }

        [HttpGet]
        [Route("logout")]
        [Route("~/api/profile/logout")]
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            WebSecurity.Logout();
            UserProfile.ClearCurrentVisitor();
            return Redirect(WebRequestContext.Localization.GetBaseUrl());
        }
    }   
}
