using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;
using FiftyOne.Foundation.Mobile.Detection.Entities.Stream;
using FiftyOne.Foundation.Mobile.Detection.Factories;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Degrees51
{    
    public class Degrees51PreloadClient : IProcessHostPreloadClient
    {
        public void Preload(string[] parameters)
        {
            Degrees51AreaRegistration.DownloadLite();  
        }
    }
}
