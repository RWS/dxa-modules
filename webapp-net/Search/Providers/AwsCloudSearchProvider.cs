using System;
using System.Collections.Specialized;
using Sdl.Web.Common.Logging;
using SI4T.Query.Models;

namespace Sdl.Web.Modules.Search.Providers
{
    public class AwsCloudSearchProvider : SI4TSearchProvider
    {
        protected override SearchResults ExecuteQuery(string searchIndexUrl, NameValueCollection parameters)
        {
            using (new Tracer(searchIndexUrl, parameters))
            {
                // TODO: Create SI4T.Query.CloudSearch.Connection
                throw new NotImplementedException();
            }
        }
    }
}