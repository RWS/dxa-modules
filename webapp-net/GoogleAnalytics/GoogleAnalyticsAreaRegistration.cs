using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.GoogleAnalytics
{
    public class GoogleAnalyticsAreaRegistration : BaseAreaRegistration 
    {
        public override string AreaName => "GoogleAnalytics";

        protected override void RegisterAllViewModels()
        {
            RegisterViewModel("GoogleAnalytics", typeof(Common.Models.Configuration));
        }        
    }
}
