package com.sdl.dxa.modules.dd.provider;

import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.common.dto.ClaimHolder;
import com.sdl.dxa.common.dto.DepthCounter;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.modules.dd.models.Publication;
import com.sdl.dxa.tridion.navigation.dynamic.OnDemandNavigationModelProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.api.navigation.OnDemandNavigationProvider;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class TocProvider {
    private static final Pattern RegEx = Pattern.compile("^\\w?(\\d+)(-\\w)?(\\d+)?");

    @Autowired
    private PublicationProvider publicationProvider;

    @Autowired
    private OnDemandNavigationProvider provider;

    @Autowired
    private OnDemandNavigationModelProvider onDemandNavigationModelProvider;
//    public Collection<SitemapItemModelData> getToc(int publicationId, Localization localization, String sitemapItemId, boolean includeAncestors, Map<String, ClaimHolder> claims) throws DynamicDocumentationException, DxaItemNotFoundException {
//        return getToc(publicationId, localization, null, false, 1, null);
//    }
//
//    public Collection<SitemapItemModelData> getToc(int publicationId, Localization localization, String sitemapItemId) throws DynamicDocumentationException, DxaItemNotFoundException {
//        return getToc(publicationId, localization, sitemapItemId, false, 1, null);
//    }
//
//    public Collection<SitemapItemModelData> getToc(int publicationId, Localization localization, String sitemapItemId, boolean includeAncestors) throws DynamicDocumentationException, DxaItemNotFoundException {
//        return getToc(publicationId, localization, sitemapItemId, includeAncestors, 1, null);
//    }

    public Collection<SitemapItemModelData> getToc(int publicationId, Localization localization, String sitemapItemId, boolean includeAncestors,
                                                   int descendantLevels, ClaimHolder claims) throws DxaItemNotFoundException {
        publicationProvider.checkPublicationOnline(publicationId);

        NavigationFilter navigationFilter = new NavigationFilter();
        navigationFilter.setDescendantLevels(descendantLevels);
        navigationFilter.setWithAncestors(includeAncestors);

        Collection<SitemapItemModelData> sitemapItems = getSitemapItemModelData(publicationId, localization, sitemapItemId, claims, navigationFilter);

        //Set<SitemapItem> sitemapItems = new LinkedHashSet<>(provider.getNavigationSubtree(sitemapItemId, navigationFilter, localization));
//        Collection<SitemapItemModelData> sitemapItems = subtree.get();

        if (sitemapItems.size() == 0)
            throw new DxaItemNotFoundException("No sitemap items found.");

        if (includeAncestors) {
            // if we are including ancestors we also need to get all the direct siblings for each
            // level in the hierarchy.

            sitemapItems.forEach(SitemapItemModelData::rebuildParentRelationships);
            SitemapItemModelData node = findNode(sitemapItems, sitemapItemId);

            // for each parent node get sibling nodes
            while (node.getParent() != null) {
                navigationFilter.setDescendantLevels(1);
                navigationFilter.setWithAncestors(false);
                //Collection<SitemapItem> siblings = provider.getNavigationSubtree(node.getParent().getId(), navigationFilter, localization);
                //Collection<SitemapItem> siblings = onDemandNavigationModelProvider.getNavigationSubtree(node.getParent().getId(), navigationFilter, localization);
                //Optional<Collection<SitemapItemModelData>> subtree = getSitemapItemModelData(localization, sitemapItemId, claimHolder, navigationFilter);
                Collection<SitemapItemModelData> siblings = getSitemapItemModelData(publicationId, localization, node.getParent().getId(), claims, navigationFilter);

                HashSet<String> children = new HashSet<>();
                for (SitemapItemModelData item : node.getParent().getItems()) {
                    children.add(item.getId());
                }
                // filter out duplicates and Page types since we don't wish to include them in TOC
                for (SitemapItemModelData sibling : siblings) {
                    if (sibling.getId() != node.getId()
                            && !sibling.getType().equals("Page")
                            && !children.contains(sibling.getId())) {
                        node.getParent().getItems().add(sibling);
                    }
                }
                node = node.getParent();
            }
        }
        fixupSitemap(sitemapItems, true, true);
        return sitemapItems;
    }

    private Collection<SitemapItemModelData> getSitemapItemModelData(Integer publicationId, Localization localization, String sitemapItemId, ClaimHolder claimHolder, NavigationFilter navigationFilter) throws DxaItemNotFoundException {
        Optional<Collection<SitemapItemModelData>> subtree;

        SitemapRequestDto requestDto = SitemapRequestDto
                .builder(publicationId)
                .navigationFilter(navigationFilter)
                .expandLevels(new DepthCounter(navigationFilter.getDescendantLevels()))
                .sitemapId(sitemapItemId)
                .uriType(localization.getCmUriScheme())
                .build();
        requestDto.addClaim(claimHolder);

        subtree = onDemandNavigationModelProvider.getNavigationSubtree(requestDto);
        if (!subtree.isPresent()) {
            throw new DxaItemNotFoundException("No TOC found");
        }
        return subtree.get();
    }

    public SitemapItemModelData siteMap(Localization localization) throws DxaItemNotFoundException {
//        return SiteConfiguration.CacheProvider.GetOrAdd(
//                $"sitemap-{localization.Id ?? "full"}", CacheRegion.Sitemap,
//                () = >
//                {
                        // Workaround: Currently the content service is not returning a sitemap for Docs only content
                        // so the workaround is for each publication get the entire subtree and merge the results.
                        // This will cause several requests to be issued and results in quite a slow performance.
//                        IOnDemandNavigationProvider provider =
//                        SiteConfiguration.NavigationProvider as IOnDemandNavigationProvider;

        if (provider == null) return null;

        NavigationFilter navigationFilter = new NavigationFilter();
        navigationFilter.setWithAncestors(false);
        navigationFilter.setDescendantLevels(-1);

        List<SitemapItemModelData> sitemapItems = new ArrayList<>();
//        if (localization != null) {
//            //sitemapItems.addAll(provider.getNavigationSubtree(null, navigationFilter, localization));
//            Collection<SitemapItemModelData> siblings = getSitemapItemModelData(localization, null, null, navigationFilter);
//            sitemapItems.addAll(siblings);
//        } else {
            List<Publication> pubs = publicationProvider.publicationList();
            for (Publication pub : pubs) {
//            foreach(var pub in pubs)
//            {
//                DocsLocalization loc = new DocsLocalization();
//                loc.setPublicationId(pub.getId());
                //Collection<SitemapItem> items = provider.getNavigationSubtree(null, navigationFilter, loc);
                Collection<SitemapItemModelData> items = getSitemapItemModelData(Integer.parseInt(pub.getId()), localization, null, null, navigationFilter);
                for (SitemapItemModelData item : items) {
                    sitemapItems.addAll(item.getItems());
                }
            }
//        }
        fixupSitemap(sitemapItems, false, false);
        SitemapItemModelData result = new SitemapItemModelData();
        result.setItems(sitemapItems);
        return result;
//                });
    }

    private static SitemapItemModelData findNode(Collection<SitemapItemModelData> nodes, String nodeId) {
        if (nodes == null) return null;
        for (SitemapItemModelData node : nodes) {
            if (node.getId().equals(nodeId)) return node;
            if (node.getItems() == null || node.getItems().size() <= 0) continue;
            SitemapItemModelData found = findNode(node.getItems(), nodeId);
            if (found != null) return found;
        }
        return null;
    }

    private static void fixupSitemap(Collection<SitemapItemModelData> toc, boolean removePageNodes, boolean orderNodes) {
        if (toc == null) return;
        List<SitemapItemModelData> newToc = new ArrayList<>();
        for (SitemapItemModelData entry : toc) {
            if (removePageNodes && entry.getType().equals("Page")) {
                //toc.remove(toc);
                continue;
            }
            newToc.add(entry);
            String url = entry.getUrl();
            if (url != null) {
                // Remove all occurences of '/' at the beginning of the url and replace it with a single one:
                String fixedUrl = "/" + url.replaceFirst("/*", "");
                entry.setUrl(fixedUrl);
            }
            if (entry.getItems() == null) continue;
            fixupSitemap(entry.getItems(), removePageNodes, orderNodes);
        }

        if (orderNodes) {
            List<SitemapItemModelData> ordered = newToc.stream().map(sitemapItem -> new SortableSiteMap(sitemapItem))
                    .sorted(
                            Comparator.comparing(SortableSiteMap::getOne)
                                    .thenComparing(SortableSiteMap::getTwo))
                    .map(SortableSiteMap::getSitemapItem).collect(Collectors.toList());
            newToc = ordered;
        }
        toc.clear();
        toc.addAll(newToc);
    }

    /**
     * A private class that contains the results of the regex so they only have to be done once for a whole sorting.
     */
    private static class SortableSiteMap {
        private Integer one;
        private Integer two;
        private SitemapItemModelData sitemapItem;

        public SortableSiteMap(SitemapItemModelData sitemapItem) {
            this.sitemapItem = sitemapItem;
            Matcher matcher = RegEx.matcher(sitemapItem.getId());
            if (matcher.matches()) {
                String group1 = matcher.group(1);
                String group3 = matcher.group(3);
                if (StringUtils.isNotEmpty(group1)) {
                    this.one = Integer.parseInt(group1);
                }
                if (StringUtils.isNotEmpty(group3)) {
                    this.two = Integer.parseInt(group3);
                }
            }
        }

        public Integer getOne() {
            return one;
        }

        public Integer getTwo() {
            return two;
        }

        public SitemapItemModelData getSitemapItem() {
            return sitemapItem;
        }
    }
}
