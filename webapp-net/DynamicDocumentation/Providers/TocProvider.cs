using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Common.Models.Navigation;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.DynamicDocumentation.Providers
{
    public class TocProvider
    {
        private static readonly Regex RegEx = new Regex("^(?:\\w)(\\d+)(?:-\\w)(\\d+)", RegexOptions.Compiled);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization)
           => GetToc(localization, null, false, 1);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization, string sitemapItemId)
          => GetToc(localization, sitemapItemId, false, 1);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization, string sitemapItemId, bool includeAncestors)
            => GetToc(localization, sitemapItemId, includeAncestors, 1);

        public IEnumerable<SitemapItem> GetToc(ILocalization localization, string sitemapItemId, bool includeAncestors,
            int descendantLevels)
        {
            IOnDemandNavigationProvider provider =
                SiteConfiguration.NavigationProvider as IOnDemandNavigationProvider;

            NavigationFilter navigationFilter = new NavigationFilter
            {
                DescendantLevels = descendantLevels,
                IncludeAncestors = includeAncestors
            };

            var sitemapItems = provider.GetNavigationSubtree(sitemapItemId, navigationFilter, localization).ToList();
            if (includeAncestors)
            {
                // if we are including ancestors we also need to get all the direct siblings for each
                // level in the hirarchy.

                SitemapItem node = FindNode(sitemapItems, sitemapItemId);

                // for each parent node get sibling nodes
                while (node.Parent != null)
                {
                    var siblings = provider.GetNavigationSubtree(node.Parent.Id, new NavigationFilter {DescendantLevels = 1, IncludeAncestors = false}, localization);

                    // filter out duplicates and Page types since we don't wish to include them in TOC
                    foreach (var sibling in siblings.Where(sibling => sibling.Id != node.Id && sibling.Type != "Page"))
                    {
                        node.Parent.Items.Add(sibling);
                    }

                    node = node.Parent;
                }
            }

            FixupSitemap(sitemapItems);
            return sitemapItems;
        }

        public SitemapItem SiteMap(ILocalization localization)
        {
            SitemapItem model = SiteConfiguration.NavigationProvider.GetNavigationModel(localization);
            FixupSitemap(new List<SitemapItem> {model});
            return model;
        }

        private static SitemapItem FindNode(IEnumerable<SitemapItem> nodes, string nodeId)
        {
            if (nodes == null) return null;
            foreach (var node in nodes)
            {
                if (node.Id == nodeId) return node;
                if (node.Items == null || node.Items.Count <= 0) continue;
                var found = FindNode(node.Items, nodeId);
                if (found != null) return found;
            }
            return null;
        }

        private static void FixupSitemap(List<SitemapItem> toc)
        {
            if (toc == null) return;            
            for (int i=0; i<toc.Count; i++)
            {
                SitemapItem entry = toc[i];
                if (entry.Type == "Page")
                {
                    toc.RemoveAt(i);
                    i--;
                    continue;
                }
                if (entry.Url != null)
                {
                    entry.Url = $"/{entry.Url.TrimStart('/')}";
                }
                if (entry.Items == null) continue;
                entry.Items = entry.Items.OrderBy(
                    x => int.Parse(RegEx.Match(x.Id).Groups[1].Value)).ThenBy(
                        x => int.Parse(RegEx.Match(x.Id).Groups[2].Value)).ToList();
                FixupSitemap(entry.Items);
            }
        }
    }
}
