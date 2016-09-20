using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Web.Mvc;
using System.Web.Security;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using WebMatrix.WebData;
using Sdl.Web.Modules.AudienceManager.Models;

namespace Sdl.Web.Modules.AudienceManager.Controllers
{
    /// <summary>
    /// Audience Manager Profile Controller
    /// </summary>
    [RoutePrefix("{localization}/api/profile")]
    public class ProfileController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel model)
        {
            using (new Tracer(model))
            {
                LoginForm loginForm = base.EnrichModel(model) as LoginForm;

                if (loginForm != null && MapRequestFormData(loginForm) && ModelState.IsValid)
                {
                    // This is login form submission and basic field validation is fine.
                    // Authenticate the user using the AudienceManager Membership Provider.
                    if (Membership.ValidateUser(loginForm.UserName, loginForm.Password))
                    {
                        FormsAuthentication.SetAuthCookie(loginForm.UserName, loginForm.RememberMe);
                        return new RedirectModel(WebRequestContext.Localization.GetBaseUrl());
                    }
                    ModelState.AddModelError("UserName", loginForm.AuthenticationErrorMessage);
                }

                return model;
            }
        }

        [HttpGet]
        [Route("logout")]
        [Route("~/api/profile/logout")]
        public ActionResult Logout()
        {
            using (new Tracer())
            {
                FormsAuthentication.SignOut();
                WebSecurity.Logout();
                UserProfile.ClearCurrentVisitor();
                return Redirect(WebRequestContext.Localization.GetBaseUrl());
            }
        }
    }   
}
