package com.sdl.dxa.modules.ish.services;

import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.common.dto.ClaimHolder;
import com.sdl.dxa.common.dto.DepthCounter;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.dxa.modules.ish.providers.PublicationService;
import com.sdl.dxa.tridion.navigation.dynamic.OnDemandNavigationModelProvider;
import com.sdl.odata.client.api.exception.ODataClientRuntimeException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.api.navigation.OnDemandNavigationProvider;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Sitemap service.
 */
@Service
@Profile("!cil.providers.active")
public class GraphQLSitemapService implements SitemapService {
    private static final String CIL_SITEMAP_DATEFORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final Pattern RegEx = Pattern.compile("^\\w?(\\d+)(-\\w)?(\\d+)?");

    @Value("${cil.sitemap.dateformat:yyyy-MM-dd HH:mm:ss}")
    private String cilSitemapDateFormat = CIL_SITEMAP_DATEFORMAT;

    @Autowired
    private OnDemandNavigationProvider provider;

    @Autowired
    private OnDemandNavigationModelProvider onDemandNavigationModelProvider;

    @Autowired
    private PublicationService publicationService;

    public String createSitemap(String contextPath, Localization localization) throws IshServiceException {
        // Workaround: Currently the content service is not returning a sitemap for Docs only content
        // so the workaround is for each publication get the entire subtree and merge the results.
        // This will cause several requests to be issued and results in quite a slow performance.

        WebSitemapGenerator sitemapGenerator;
        if (provider == null) return null;
        try {
            sitemapGenerator = new WebSitemapGenerator(contextPath);

            NavigationFilter navigationFilter = new NavigationFilter();
            navigationFilter.setWithAncestors(false);
            navigationFilter.setDescendantLevels(-1);

            List<SitemapItemModelData> sitemapItems = new ArrayList<>();
            List<Publication> pubs = publicationService.getPublicationList(localization);
            for (Publication pub : pubs) {
                Collection<SitemapItemModelData> items = getSitemapItemModelData(Integer.parseInt(pub.getId()), localization, null, null, navigationFilter);
                for (SitemapItemModelData item : items) {
                    sitemapItems.addAll(item.getItems());
                    for (SitemapItemModelData sitemapItemModelData : item.getItems()) {
                        if (sitemapItemModelData.getUrl() != null) {
                            sitemapGenerator.addUrl(contextPath + sitemapItemModelData.getUrl());
                        }
                    }
                }
            }
            fixupSitemap(sitemapItems, false, false);
            SitemapItemModelData result = new SitemapItemModelData();
            result.setItems(sitemapItems);
        } catch (MalformedURLException | ODataClientRuntimeException e) {
            throw new IshServiceException("Could not generate sitemap.", e);
        }

        return String.join("", sitemapGenerator.writeAsStrings());
    }

    private Collection<SitemapItemModelData> getSitemapItemModelData(Integer publicationId, Localization localization, String sitemapItemId, ClaimHolder claimHolder, NavigationFilter navigationFilter) {
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

        return subtree.get();
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
