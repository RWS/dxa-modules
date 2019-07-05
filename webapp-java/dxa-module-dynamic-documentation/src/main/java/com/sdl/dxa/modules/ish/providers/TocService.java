package com.sdl.dxa.modules.ish.providers;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.sdl.webapp.common.api.serialization.json.filter.IgnoreByNameInRequestFilter.ignoreByName;

/**
 * TocService class.
 */
@Service
@Slf4j
public class TocService {
    private static final Pattern RegEx = Pattern.compile("^\\w?(\\d+)(-\\w)?(\\d+)?");

    @Autowired
    @Qualifier("ishNavigationProvider")
    private IshDynamicNavigationProvider ishNavigationProvider;

    public Collection<SitemapItem> getToc(Integer publicationId, String sitemapItemId, boolean includeAncestors,
                                          int descendantLevels, HttpServletRequest request,
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

        ignoreByName(request, "XpmMetadata", "XpmPropertyMetadata");

        NavigationFilter navigationFilter = new NavigationFilter();
        navigationFilter.setWithAncestors(includeAncestors);
        navigationFilter.setDescendantLevels(descendantLevels);
        List<SitemapItem> navigationSubtree = null;
        try {
            navigationSubtree = new ArrayList(ishNavigationProvider.getNavigationSubtree(sitemapItemId, navigationFilter, localization));
        } catch (DxaItemNotFoundException e) {
            log.warn("Such item (" + sitemapItemId + ") for publication " + publicationId + " is not found", e);
            throw e;
        }
        navigationSubtree = navigationSubtree.stream().map(sitemapItem -> new SortableSiteMap(sitemapItem))
                .sorted(
                        Comparator.comparing(SortableSiteMap::getOne)
                                .thenComparing(SortableSiteMap::getTwo))
                .map(SortableSiteMap::getSitemapItem).collect(Collectors.toList());
        return fixupSitemap(navigationSubtree, true);
    }

    private static List<SitemapItem> fixupSitemap(Collection<SitemapItem> toc, boolean removePageNodes) {
        List<SitemapItem> result = null;
        if (toc == null) return result;
        result = new ArrayList<>();
        for (SitemapItem entry : toc) {
            if (removePageNodes && entry.getType() != null && entry.getType().equals("Page")) {
                continue;
            }
            String url = entry.getUrl();
            if (url != null) {
                // Remove all occurences of '/' at the beginning of the url and replace it with a single one:
                String fixedUrl = "/" + url.replaceFirst("/*", "");
                entry.setUrl(fixedUrl);
            }
            result.add(entry);
        }
        return result;
    }

    /**
     * A private class that contains the results of the regex so they only have to be done once for a whole sorting.
     */
    private static class SortableSiteMap {
        private Integer one;
        private Integer two;
        private SitemapItem sitemapItem;

        public SortableSiteMap(SitemapItem sitemapItem) {
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

        public SitemapItem getSitemapItem() {
            return sitemapItem;
        }
    }
}
