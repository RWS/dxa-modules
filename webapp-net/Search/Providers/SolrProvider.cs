using System.Collections.Specialized;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Modules.Search.Models;
using SI4T.Query.Models;

namespace Sdl.Web.Modules.Search.Providers
{
    public class SolrProvider : SI4TSearchProvider
    {
        protected override NameValueCollection SetupParameters(SearchQuery searchQuery, Localization localization)
        {
            NameValueCollection parameters = base.SetupParameters(searchQuery, localization);
            // We use the highlighting feature to autogenerate a Summary if no Summary is present in the search index.
            parameters["hl"] = "true";
            return parameters;
        }

        protected override SearchResults ExecuteQuery(string searchIndexUrl, NameValueCollection parameters)
        {
            using (new Tracer(searchIndexUrl, parameters))
            {
                SI4T.Query.Solr.Connection solrConnection = new SI4T.Query.Solr.Connection(searchIndexUrl);
                return solrConnection.ExecuteQuery(parameters);
            }
        }
    }
}