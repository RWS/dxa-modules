using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Common.Models.Navigation;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.DynamicDocumentation.Providers
{
    public class TocProvider
    {       
        public IEnumerable<SitemapItem> GetToc(ILocalization localization)
           => GetToc(localization, null, false, 1);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization, string sitemapItemId)
          => GetToc(localization, sitemapItemId, false, 1);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization, string sitemapItemId, bool includeAncestors)
            => GetToc(localization, sitemapItemId, includeAncestors, 1);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization, string sitemapItemId, bool includeAncestors,
            int descendantLevels)
        {
            IOnDemandNavigationProvider onDemandNavigationProvider = SiteConfiguration.NavigationProvider as IOnDemandNavigationProvider;

            NavigationFilter navigationFilter = new NavigationFilter
            {
                DescendantLevels = descendantLevels,
                IncludeAncestors = includeAncestors
            };

            var result = onDemandNavigationProvider.GetNavigationSubtree(sitemapItemId, navigationFilter, localization);
            var sitemapItems = result as SitemapItem[] ?? result.ToArray();
            FixupUrls(sitemapItems);
            return sitemapItems;
        }

        public SitemapItem SiteMap(ILocalization localization)
        {
            SitemapItem model = SiteConfiguration.NavigationProvider.GetNavigationModel(localization);
            FixupUrls(new[] {model});
            return model;
        }

        private static void FixupUrls(IEnumerable<SitemapItem> toc)
        {
            if (toc == null) return;
            foreach (var x in toc)
            {
                if (x.Url != null)
                {
                    x.Url = $"/{x.Url.TrimStart('/')}";
                }               
                FixupUrls(x.Items);
            }
        }
    }
}
