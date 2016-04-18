using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Sdl.Web.Common;
using Sdl.Web.Common.Logging;

namespace Sdl.Web.Modules.AzureWebApp
{
    /// <summary>
    /// Wrapper class for access to Topology Manager
    /// </summary>
    internal static class TopologyManager
    {
        private static readonly string _ttmBaseUrl;
        private static readonly string _ttmUserName;
        private static readonly string _ttmPassword;

        /// <summary>
        /// Class constructor
        /// </summary>
        static TopologyManager()
        {
            using (new Tracer())
            {
                _ttmBaseUrl = GetConfigValue("ttm-url");
                _ttmUserName = GetConfigValue("ttm-username");
                _ttmPassword = GetConfigValue("ttm-password");
            }
        }

        private static string GetConfigValue(string key)
        {
            string result = WebConfigurationManager.AppSettings[key];
            if (string.IsNullOrEmpty(result))
            {
                Log.Warn("appSetting '{0}' is not configured", key);
            }
            return result;
        }

        internal static void RegisterWebsiteBaseUrl(string baseUrl)
        {
            using (new Tracer(baseUrl))
            {
                if (string.IsNullOrEmpty(_ttmBaseUrl))
                {
                    throw new DxaException("Automatic Topology Manager registration is not enabled (ttm-url is not configured).");
                }

                // We're using a very simple, "TTM Facade" REST webservice for registering the Website Base URL in Topology Manager.
                string ttmFacadeUrl = _ttmBaseUrl + "/api/TtmFacade/RegisterWebsiteBaseUrl";
                try
                {
                    WebRequest ttmFacadeRequest = WebRequest.CreateHttp(ttmFacadeUrl);
                    if (string.IsNullOrEmpty(_ttmUserName))
                    {
                        Log.Info("Using anonymous access (ttm-username is not configured).");
                    }
                    else
                    {
                        ttmFacadeRequest.Credentials = new NetworkCredential(_ttmUserName, _ttmPassword);
                    }
                    ttmFacadeRequest.Method = "POST";
                    ttmFacadeRequest.ContentType = "application/json";
                    using (Stream requestContentStream = ttmFacadeRequest.GetRequestStream())
                    {
                        IDictionary<string, string> requestParams = new Dictionary<string, string>()
                        {
                            {"BaseUrl", baseUrl}
                        };
                        string requestBody = JsonConvert.SerializeObject(requestParams);
                        byte[] requestBytes = Encoding.UTF8.GetBytes(requestBody);
                        requestContentStream.Write(requestBytes, 0, requestBytes.Length);
                    }

                    WebResponse ttmFacadeResponse = ttmFacadeRequest.GetResponse();
                    using (Stream responseStream = ttmFacadeResponse.GetResponseStream())
                    {
                        string responseBody = new StreamReader(responseStream).ReadToEnd();
                        string returnValue = JsonConvert.DeserializeObject<string>(responseBody);
                        if (!string.IsNullOrEmpty(returnValue))
                        {
                            throw new DxaException(returnValue);
                        }
                    }
                    Log.Info("Successfully registered Base URL '{0}'", baseUrl);
                }
                catch (Exception ex)
                {
                    throw new DxaException(string.Format("An error occured while communicating with '{0}'", ttmFacadeUrl), ex);
                }
            }
        }
    }
}
