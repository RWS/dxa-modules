using System;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Degrees51
{
    public class Degrees51AreaRegistration : BaseAreaRegistration
    {
        public static readonly string LiteUri = "https://github.com/51Degrees/dotNET-Device-Detection/blob/master/data/51Degrees-LiteV3.2.dat?raw=true";

        public override string AreaName => "Degrees51";

        /// <summary>
        /// Attempt to download the Lite dataset from 51Degrees if no dataset exists.
        /// </summary>
        public static void DownloadLite()
        {
            try
            {
                string liteUri = WebConfigurationManager.AppSettings["fiftyOneDegrees.lite.dataset"] ?? LiteUri;
                // we need to read the BinaryFilePath to find out where 51degree's is looking for its dataset but unfortunatly this is an
                // internal property so we use reflection to get it.
                var configSection = WebConfigurationManager.GetWebApplicationSection("fiftyOne/detection");
                if(configSection == null)
                {
                    Log.Error("No fiftyOne/detection configuration section found. Please make sure 51 Degrees device detection is configured correctly.");
                    return;
                }
                Type configSectionType = configSection.GetType();
                System.Reflection.PropertyInfo info = configSectionType.GetProperty("BinaryFilePath", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
                string path = (string)info.GetValue(configSection);
                if (path.Contains("~"))
                {
                    // remap to physical path if required
                    path = HttpContext.Current.Server.MapPath(path);
                }
                FileInfo fileInfo = new FileInfo(path);

                Log.Info($"Checking if 51 Degrees DataSet is available at '{path}'");
                // check if dataset file exists              
                if (!fileInfo.Exists)
                {
                    Log.Info($"51 Degrees DataSet not available. Downloading Lite version at '{liteUri}'");
                    if (!Directory.Exists(fileInfo.DirectoryName))
                    {
                        Directory.CreateDirectory(fileInfo.DirectoryName);
                    }
                    // we need to download the lite dataset at this point
                    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(liteUri);
                    request.Method = "GET";
                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    using (FileStream fileStream = fileInfo.Create())
                    {
                        response.GetResponseStream().CopyTo(fileStream);
                    }
                }
                else
                {
                    Log.Info("Found 51 Degrees DataSet.");
                }
            }
            catch(Exception ex)
            {
                Log.Error("Failed to check if the 51 Degrees DataSet file was available.", ex);
            }
        }

        protected override void RegisterAllViewModels()
        {
            // We use this as a hook to download the Lite dataset if it doesn't exist at Application_Start       
            Log.Info("Checking for 51 Degrees DataSet through Application_Start.");
            DownloadLite();           
        }
    }
}
