using System.Web.Hosting;

namespace Sdl.Web.Modules.Degrees51
{    
    /// <summary>
    /// Degrees51PreloadClient
    /// 
    /// This class can be used by IIS with the autoStart settings (if available). If configured correctly
    /// starting of the site through IIS should check/download the Lite version of the DataSet. If this is
    /// not configured then the old style Application_Start fallback will be used.
    /// </summary>
    public class Degrees51PreloadClient : IProcessHostPreloadClient
    {
        public void Preload(string[] parameters)
        {
            Degrees51AreaRegistration.DownloadLite();  
        }
    }
}
