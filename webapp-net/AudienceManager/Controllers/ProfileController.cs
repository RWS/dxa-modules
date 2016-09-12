using Sdl.Web.Modules.AudienceManager.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Security;

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
            // TODO:
            // Do we use a membership provider, ASP.NET Identity for authentication ?
            if (this.ModelState.IsValid /*&& Membership.ValidateUser(model.Username, model.Password)*/)
            {
                FormsAuthentication.SetAuthCookie(model.Username, model.RememberMe);
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
