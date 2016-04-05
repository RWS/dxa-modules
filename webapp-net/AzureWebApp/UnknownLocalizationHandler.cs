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
    /// Unknown Localization Handler used for Just-In-Time Provisioning.
    /// </summary>
    public class UnknownLocalizationHandler : IUnknownLocalizationHandler
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
                // NOTE: temporary, dummy implementation for testing purposes only.

                if (request.Url.AbsolutePath.StartsWith("/default"))
                {
                    return null; // Use default error handling
                }

                if (request.Url.AbsolutePath.StartsWith("/retry"))
                {
                    return WebRequestContext.Localization;
                }

                response.StatusCode = (int) HttpStatusCode.OK;
                response.ContentType = "text/html";
                response.Write(string.Format("<html><body>Oops... don't worry; DXA Web App will fix this: {0}</body></html>", exception.Message));
                response.End(); // This terminates the HTTP processing pipeline

                return null; // Should never get here
            }
        }
        #endregion
    }
}
