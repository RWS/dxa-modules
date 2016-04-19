using System;
using System.Net;
using System.Web;
using Sdl.Web.Common;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.AzureWebApp
{
    /// <summary>
    /// Unknown Localization Handler used for Just-In-Time Provisioning in Azure Web App.
    /// </summary>
    public class AzureUnknownLocalizationHandler : IUnknownLocalizationHandler
    {

        #region IUnknownLocalizationHandler members
        /// <summary>
        /// Handles a Request for an Unknown Localization (i.e. the request URL doesn't map to a Publication).
        /// </summary>
        /// <param name="exception">The <see cref="DxaUnknownLocalizationException"/> exception.</param>
        /// <param name="request">The HTTP Request.</param>
        /// <param name="response">The HTTP Response. In order to return a different HTTP Response than the default, 
        /// the response headers and body should be set and <see cref="HttpResponse.End"/> should be called to terminate the HTTP processing pipeline.
        /// </param>
        /// <returns>May return a <see cref="Localization"/> instance if the handler manages to resolve the Localization. If <c>null</c> is returned, default error handling will be applied.</returns>
        public Localization HandleUnknownLocalization(DxaUnknownLocalizationException exception, HttpRequest request, HttpResponse response)
        {
            using (new Tracer(exception, request, response))
            {
                // Just-In-Time register the current Website's Base URL in Topology Manager:
                string websiteBaseUrl = request.Url.GetLeftPart(UriPartial.Authority).ToLowerInvariant();
                try
                {
                    Log.Info("Base URL '{0}' does not resolve to a Localization yet; registering this Base URL in Topology Manager...", websiteBaseUrl);
                    TopologyManager.RegisterWebsiteBaseUrl(websiteBaseUrl);
                }
                catch (Exception ex)
                {
                    Log.Error(ex);
                    SendNotFoundResponse("Registering the website in Topology Manager failed. Check the log for details.", response);
                }

                // If all is well, WebRequestContext.Localization should resolve now, but it will take a while before the Discovery Service cache is updated:
                for (int retry = 1; retry <= 5; retry++)
                {
                    System.Threading.Thread.Sleep(1000);
                    try
                    {
                        return WebRequestContext.Localization;
                    }
                    catch (DxaUnknownLocalizationException)
                    {
                        Log.Info("Still unable to resolve Localization after {0} seconds...", retry);
                    }
                }

                // For some reason, we still can't resolve the URL; let DXA Framework return a standard error.
                Log.Error("After registering Base URL '{0}' in Topology Manager, still no Localization can be resolved.", websiteBaseUrl);
                SendNotFoundResponse("Your website was registered in Topology Manager, but Localization cannot be resolved. Please contact SDL.", response);

                return null; // Should never come here.
            }
        }
        #endregion

        private static void SendNotFoundResponse(string message, HttpResponse httpResponse)
        {
            httpResponse.StatusCode = (int) HttpStatusCode.NotFound;
            httpResponse.ContentType = "text/plain";
            httpResponse.Write(message);
            httpResponse.End(); // This terminates the HTTP processing pipeline
        }
    }
}
