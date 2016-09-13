using Sdl.Web.Modules.AudienceManager.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Web.Mvc;
using System.Web.Security;

namespace Sdl.Web.Modules.AudienceManager.Controllers
{
    /// <summary>
    /// ProfileController
    /// 
    /// A membership provider is required to be configured in your Web.Config:
    /// <system.web>
    ///     ...
    ///     <membership defaultProvider="AudienceManagerMembership">
    ///         <providers>
    ///             <clear />
    ///             <add name="AudienceManagerMembership" type="Sdl.Web.Modules.AudienceManager.Security.AudienceManagerMembershipProvider, Sdl.Web.Modules.AudienceManager, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" applicationName="/" enablePasswordReset="false" enablePasswordRetrieval="false" minRequiredPasswordLength="3" passwordFormat="Clear" requiresQuestionAndAnswer="false" requiresUniqueEmail="false" />
    ///         </providers>
    ///     </membership>
    ///     ...
    /// </system.web>
    /// 
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
            // TODO
            return Redirect(WebRequestContext.Localization.GetBaseUrl());
        }
    }   
}
