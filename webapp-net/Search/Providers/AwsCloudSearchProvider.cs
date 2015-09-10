using System.Collections.Specialized;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Modules.Search.Models;
using SI4T.Query.Models;

namespace Sdl.Web.Modules.Search.Providers
{
    public class AwsCloudSearchProvider : SI4TSearchProvider
    {
        protected override NameValueCollection SetupParameters(SearchQuery searchQuery, Localization localization)
        {
            NameValueCollection result = base.SetupParameters(searchQuery, localization);
            return result;
        }

        protected override SearchResults ExecuteQuery(string searchIndexUrl, NameValueCollection parameters)
        {
            using (new Tracer(searchIndexUrl, parameters))
            {
                SI4T.Query.CloudSearch.Connection cloudSearchConnection = new SI4T.Query.CloudSearch.Connection(searchIndexUrl);
                return cloudSearchConnection.ExecuteQuery(parameters);
            }
        }
    }
}