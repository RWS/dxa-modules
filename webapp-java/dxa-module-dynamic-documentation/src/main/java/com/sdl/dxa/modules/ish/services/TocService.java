package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.providers.IshDynamicNavigationProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.model.sorting.SortableSiteMap;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * TocService class.
 */
@Service
@Slf4j
public class TocService {
    @Autowired
    @Qualifier("ishNavigationProvider")
    private IshDynamicNavigationProvider ishNavigationProvider;

    @Cacheable(value = "ish", key = "{ #publicationId, #sitemapItemId, #includeAncestors, #descendantLevels, #conditions }", sync = true)
    public Collection<SitemapItem> getToc(Integer publicationId,
                                          String sitemapItemId,
                                          boolean includeAncestors,
                                          int descendantLevels,
                                          String conditions,
                                          WebRequestContext webRequestContext) throws ContentProviderException {
        if (ishNavigationProvider == null) {
            String message = "On-Demand Navigation is not enabled because current navigation provider doesn't " +
                    "support it. If you are using your own navigation provider, you should Implement " +
                    "OnDemandNavigationProvider interface, otherwise check document on how you should enable " +
                    "OnDemandNavigation.";
            log.warn(message);
            throw new UnsupportedOperationException(message);
        }

        Localization localization = webRequestContext.getLocalization();

        NavigationFilter navigationFilter = new NavigationFilter();
        navigationFilter.setWithAncestors(includeAncestors);
        navigationFilter.setDescendantLevels(descendantLevels);
        List<SitemapItem> navigationSubtree = null;
        try {
            navigationSubtree = new ArrayList(ishNavigationProvider.getNavigationSubtree(sitemapItemId, navigationFilter, localization));
        } catch (DxaItemNotFoundException e) {
            String message = "Such item (" + sitemapItemId + ") for publication " + publicationId + " is not found";
            throw new DxaItemNotFoundException(message, e);
        }

        if (!includeAncestors) {
            return fixupSiteMap(navigationSubtree, true);
        }
        // if we are including ancestors we also need to get all the direct siblings for each
        // level in the hierarchy.

        SitemapItem node = findNode(navigationSubtree, sitemapItemId);

        // for each parent node get sibling nodes
        while (node != null && node.getParent() != null) {
            NavigationFilter explicitFilter = new NavigationFilter();
            explicitFilter.setWithAncestors(false);
            explicitFilter.setDescendantLevels(1);

            Collection<SitemapItem> siblings = ishNavigationProvider.getNavigationSubtree(node.getParent().getId(),
                    explicitFilter,
                    localization);

            HashSet<String> children = new HashSet<>();
            for(SitemapItem item : node.getParent().getItems()) {
                children.add(item.getId());
            }
            // filter out duplicates and Page types since we don't wish to include them in TOC
            String nodeId = node.getId();
            siblings = siblings
                    .stream()
                    .filter(sibling -> !sibling.getId().equals(nodeId) && !"Page".equals(sibling.getType()) && !children.contains(sibling.getId()))
                    .collect(Collectors.toList());
            for (SitemapItem sibling : siblings) {
                node.getParent().getItems().add(sibling);
            }

            node = node.getParent();
        }

        return fixupSiteMap(navigationSubtree, true);
    }

    private static SitemapItem findNode(Collection<SitemapItem> nodes, String nodeId) {
        if (nodes == null) return null;
        for (SitemapItem node : nodes) {
            if (node.getId().equals(nodeId)) return node;
            if (node.getItems().isEmpty()) continue;
            SitemapItem found = findNode(node.getItems(), nodeId);
            if (found != null) return found;
        }
        return null;
    }

    private static Collection<SitemapItem> fixupSiteMap(Collection<SitemapItem> toc, boolean removePageNodes) {
        fixupSiteMapRecursive(toc, removePageNodes);
        return SortableSiteMap.sortItem(toc, SortableSiteMap.SORT_BY_TAXONOMY_AND_KEYWORD);
    }

    private static void fixupSiteMapRecursive(Collection<SitemapItem> toc, boolean removePageNodes) {
        if (toc == null) return;

        Iterator<SitemapItem> i = toc.iterator();
        while(i.hasNext()) {
            SitemapItem entry = i.next();
            if (removePageNodes && "Page".equals(entry.getType())) {
                i.remove();
                continue;
            }

            String url = entry.getUrl();
            if (url != null) {
                // Remove all occurences of '/' at the beginning of the url and replace it with a single one:
                String fixedUrl = "/" + url.replaceFirst("/*", "");
                entry.setUrl(fixedUrl);
            }

            if (entry.getItems().isEmpty()) continue;

            Collection<SitemapItem> items = fixupSiteMap(entry.getItems(), true);
            entry.setItems(items);
        }
    }
}
