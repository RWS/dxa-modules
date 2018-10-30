using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Sdl.Web.Common;
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
            return SiteConfiguration.CacheProvider.GetOrAdd(
                $"toc-{localization.Id}-{sitemapItemId}-{includeAncestors}", CacheRegion.Toc,
                () =>
                {
                    new PublicationProvider().CheckPublicationOnline(int.Parse(localization.Id));

                    IOnDemandNavigationProvider provider =
                        SiteConfiguration.NavigationProvider as IOnDemandNavigationProvider;

                    NavigationFilter navigationFilter = new NavigationFilter
                    {
                        DescendantLevels = descendantLevels,
                        IncludeAncestors = includeAncestors
                    };

                    var sitemapItems =
                        provider.GetNavigationSubtree(sitemapItemId, navigationFilter, localization).ToList();

                    if (sitemapItems.Count == 0)
                        throw new DxaItemNotFoundException("No sitemap items found.");

                    if (includeAncestors)
                    {
                        // if we are including ancestors we also need to get all the direct siblings for each
                        // level in the hirarchy.

                        SitemapItem node = FindNode(sitemapItems, sitemapItemId);

                        // for each parent node get sibling nodes
                        while (node.Parent != null)
                        {
                            var siblings = provider.GetNavigationSubtree(node.Parent.Id,
                                new NavigationFilter {DescendantLevels = 1, IncludeAncestors = false}, localization);

                            HashSet<string> children = new HashSet<string>();
                            foreach (var item in node.Parent.Items)
                            {
                                children.Add(item.Id);
                            }
                            // filter out duplicates and Page types since we don't wish to include them in TOC
                            foreach (
                                var sibling in
                                    siblings.Where(
                                        sibling =>
                                            sibling.Id != node.Id && sibling.Type != "Page" &&
                                            !children.Contains(sibling.Id)))
                            {
                                node.Parent.Items.Add(sibling);
                            }

                            node = node.Parent;
                        }
                    }

                    FixupSitemap(sitemapItems, true, true);
                    return sitemapItems;
                });
        }

        public SitemapItem SiteMap(ILocalization localization)
        {
            return SiteConfiguration.CacheProvider.GetOrAdd(
                $"sitemap-{localization.Id ?? "full"}", CacheRegion.Sitemap,
                () =>
                {
                    // Workaround: Currently the content service is not returning a sitemap for Docs only content
                    // so the workaround is for each publication get the entire subtree and merge the results.
                    // This will cause several requests to be issued and results in quite a slow performance.
                    IOnDemandNavigationProvider provider =
                        SiteConfiguration.NavigationProvider as IOnDemandNavigationProvider;

                    if (provider == null) return null;

                    NavigationFilter navigationFilter = new NavigationFilter
                    {
                        DescendantLevels = -1,
                        IncludeAncestors = false
                    };

                    List<SitemapItem> sitemapItems = new List<SitemapItem>();
                    if (!string.IsNullOrEmpty(localization?.Id))
                    {
                        sitemapItems.AddRange(provider.GetNavigationSubtree(null, navigationFilter, localization));
                    }
                    else
                    {
                        var pubs = new PublicationProvider().PublicationList;
                        foreach (var pub in pubs)
                        {
                            var items = provider.GetNavigationSubtree(null, navigationFilter,
                                new DocsLocalization(int.Parse(pub.Id)));
                            foreach (var item in items)
                            {
                                sitemapItems.AddRange(item.Items);
                            }
                        }
                    }
                    FixupSitemap(sitemapItems, false, false);
                    return new SitemapItem {Items = sitemapItems};
                });
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

        private static void FixupSitemap(List<SitemapItem> toc, bool removePageNodes, bool orderNodes)
        {
            if (toc == null) return;            
            for (int i=0; i<toc.Count; i++)
            {
                SitemapItem entry = toc[i];
                if (removePageNodes && entry.Type == "Page")
                {
                    toc.RemoveAt(i);
                    i--;
                    continue;
                }
                if (entry.Url != null)
                {
                    // Note the / prefix is important here otherwise the react UI will fail since it splits on / chars.
                    entry.Url = $"/{entry.Url.TrimStart('/')}";
                }
                if (entry.Items == null) continue;
                if (orderNodes)
                {
                    entry.Items = entry.Items.OrderBy(
                        x => int.Parse(RegEx.Match(x.Id).Groups[1].Value)).ThenBy(
                            x => int.Parse(RegEx.Match(x.Id).Groups[2].Value)).ToList();
                }
                FixupSitemap(entry.Items, removePageNodes, orderNodes);
            }
        }
    }
}
