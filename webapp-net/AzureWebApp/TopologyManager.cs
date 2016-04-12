using System;
using System.Linq;
using System.Net;
using System.Web.Configuration;
using Sdl.Web.Common;
using Sdl.Web.Common.Logging;
using Tridion.TopologyManager.Client;

namespace Sdl.Web.Modules.AzureWebApp
{
    /// <summary>
    /// Wrapper class for access to Topology Manager
    /// </summary>
    internal static class TopologyManager
    {
        private static readonly TopologyManagerClient _topologyManagerClient;
        private static readonly string _websiteId;

        /// <summary>
        /// Class constructor
        /// </summary>
        static TopologyManager()
        {
            using (new Tracer())
            {
                // NOTE: this is sensitive data which should not be stored (unencrypted) in Web.config, but in a separate config file which is *outside* the web app base.
                string ttmUrl = GetConfigValue("ttm-url");
                string ttmUserName = GetConfigValue("ttm-username");
                string ttmPassword = GetConfigValue("ttm-password");
                _websiteId = GetConfigValue("ttm-website-id");

                _topologyManagerClient = new TopologyManagerClient(new Uri(ttmUrl))
                {
                    Credentials = new NetworkCredential(ttmUserName, ttmPassword)
                };
            }
        }

        private static string GetConfigValue(string key)
        {
            string result = WebConfigurationManager.AppSettings[key];
            if (string.IsNullOrEmpty(result))
            {
                throw new DxaException(string.Format("Required appSetting '{0}' is not configured.", key));
            }
            return result;
        }

        internal static void RegisterWebsiteBaseUrl(string baseUrl)
        {
            using (new Tracer(baseUrl))
            {
                WebsiteData websiteData = _topologyManagerClient.Websites.Where(ws => ws.Id == _websiteId).FirstOrDefault();
                if (websiteData == null)
                {
                    throw new DxaException("Website not found in Topology Manager: " + _websiteId);
                }
                if (websiteData.BaseUrls.Contains(baseUrl))
                {
                    Log.Warn("Website '{0}' already has Base URL '{1}'", _websiteId, baseUrl);
                    return;
                }
                websiteData.BaseUrls.Add(baseUrl);

                _topologyManagerClient.UpdateObject(websiteData);
                _topologyManagerClient.SaveChanges();

                Log.Info("Registered Base URL '{0}' for Website '{1}'", baseUrl, _websiteId);
            }
        }
    }
}
