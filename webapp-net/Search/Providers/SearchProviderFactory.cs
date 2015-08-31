using System;
using System.Collections.Generic;
using System.Reflection;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;

namespace Sdl.Web.Modules.Search.Providers
{
    public static class SearchProviderFactory
    {
        private static readonly IDictionary<string, ISearchProvider> _searchProviders = new Dictionary<string, ISearchProvider>();

        public static ISearchProvider GetSearchProvider(Localization localization)
        {
            lock (_searchProviders)
            {
                // TODO: check if settings need refresh (?)
                ISearchProvider searchProvider;
                if (!_searchProviders.TryGetValue(localization.LocalizationId, out searchProvider))
                {
                    searchProvider = CreateSearchProvider(localization);
                    _searchProviders.Add(localization.LocalizationId, searchProvider);
                }
                return searchProvider;
            }
        }

        private static ISearchProvider CreateSearchProvider(Localization localization)
        {
            using (new Tracer(localization))
            {
                string searchProviderTypeName = localization.GetConfigValue("search.searchProviderType");
                if (String.IsNullOrEmpty(searchProviderTypeName))
                {
                    // No Search Provider Type specified in CM Configuration; default to SOLR Provider.
                    return new SolrProvider();
                }

                if (!searchProviderTypeName.Contains("."))
                {
                    // Unqualified type name specified in CM Configuration.
                    searchProviderTypeName = "Sdl.Web.Modules.Search.Providers." + searchProviderTypeName;
                }

                Log.Info("Using Search Provider Type '{0}'", searchProviderTypeName);
                Type searchProviderType = Type.GetType(searchProviderTypeName, throwOnError: true);
                return (ISearchProvider)Activator.CreateInstance(searchProviderType);
            }
        }
    }
}
