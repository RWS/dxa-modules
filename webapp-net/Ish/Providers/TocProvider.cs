using System.Collections.Generic;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Common.Models.Navigation;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.Ish.Providers
{
    /// <summary>
    /// Table of Contents (TOC) Provider
    /// </summary>
    public class TocProvider
    {
        public IEnumerable<SitemapItem> GetToc(int publicationId)
           => GetToc(publicationId, null, false, 1);

        public IEnumerable<SitemapItem> GetToc(int publicationId, string sitemapItemId)
          => GetToc(publicationId, sitemapItemId, false, 1);

        public IEnumerable<SitemapItem> GetToc(int publicationId, string sitemapItemId, bool includeAncestors)
            => GetToc(publicationId, sitemapItemId, includeAncestors, 1);

        public IEnumerable<SitemapItem> GetToc(int publicationId, string sitemapItemId, bool includeAncestors,
            int descendantLevels)
        {
            IOnDemandNavigationProvider onDemandNavigationProvider = SiteConfiguration.NavigationProvider as IOnDemandNavigationProvider;
            NavigationFilter navigationFilter = new NavigationFilter
            {
                DescendantLevels = descendantLevels,
                IncludeAncestors = includeAncestors
            };

            ILocalization localization = WebRequestContext.Localization;
            localization.Id = publicationId.ToString();

            return onDemandNavigationProvider.GetNavigationSubtree(sitemapItemId, navigationFilter, localization);         
        }
    }
}
