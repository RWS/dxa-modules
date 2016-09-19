using Sdl.Web.Modules.AudienceManager.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.AudienceManager
{
    /// <summary>
    /// AudienceManagerAreaRegistration
    /// </summary>
    public class AudienceManagerAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "AudienceManager";
            }
        }

        protected override void RegisterAllViewModels()
        {
            // Entity Views
            RegisterViewModel("LoginForm", typeof(LoginForm), "Profile");
            RegisterViewModel("CurrentUserWidget", typeof(CurrentUserWidget), "Profile");
        }
    }
}
