using Sdl.Web.Modules.MediaManager.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.MediaManager
{
    public class MediaManagerAreaRegistration : BaseAreaRegistration 
    {
        public override string AreaName => "MediaManager";

        protected override void RegisterAllViewModels()
        {
            RegisterViewModel("html5dist", typeof(MediaManagerDistribution));
            RegisterViewModel("imagedist", typeof(MediaManagerDistribution));
            RegisterViewModel("downloaddist", typeof(MediaManagerDistribution));
            RegisterViewModel("audiodist", typeof(MediaManagerDistribution));
        }
    }
}
