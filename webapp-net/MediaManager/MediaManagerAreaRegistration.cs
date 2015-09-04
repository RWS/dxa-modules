using Sdl.Web.Modules.MediaManager.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.MediaManager
{
    public class MediaManagerAreaRegistration : BaseAreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MediaManager";
            }
        }

        protected override void RegisterAllViewModels()
        {
			RegisterViewModel("MediaManagerVideo", typeof(MediaManagerVideo));
        }        
    }
}
