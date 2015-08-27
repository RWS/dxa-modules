using System.Collections.Specialized;
using Sdl.Web.Common.Logging;
using SI4T.Query.Models;

namespace Sdl.Web.Modules.Search.Providers
{
    public class SolrProvider : SI4TSearchProvider
    {
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