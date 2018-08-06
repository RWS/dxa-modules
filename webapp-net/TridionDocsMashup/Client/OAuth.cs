using Sdl.Web.Delivery.DiscoveryService;
using Sdl.Web.HttpClient.Auth;
using Sdl.Web.HttpClient.Request;
using System;
using System.Net;

namespace Sdl.Web.Modules.TridionDocsMashup.Client
{
    //todo : should be removed , as DXA will provide a fully authenticated initialized PCA client 
    public class OAuth : IAuthentication
    {
        public NetworkCredential GetCredential(Uri uri, string authType)
        {
            return null;
        }

        public void ApplyManualAuthentication(IHttpClientRequest request)
        {
            request.Headers.Add(DiscoveryServiceProvider.DefaultTokenProvider.AuthRequestHeaderName, DiscoveryServiceProvider.DefaultTokenProvider.AuthRequestHeaderValue);
        }
    }

}
