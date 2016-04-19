using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.AzureWebApp
{
    public class AzureWebAppAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "AzureWebApp";
            }
        }

        protected override void RegisterAllViewModels()
        {
            // This Module doesn't define any Views (yet).
        }
    }

}
