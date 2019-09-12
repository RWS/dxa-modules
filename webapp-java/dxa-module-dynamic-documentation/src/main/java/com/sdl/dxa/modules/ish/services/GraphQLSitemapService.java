package com.sdl.dxa.modules.ish.services;

import com.google.common.base.Strings;
import com.redfin.sitemapgenerator.ChangeFreq;
import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;
import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.common.dto.ClaimHolder;
import com.sdl.dxa.common.dto.DepthCounter;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.dxa.tridion.navigation.dynamic.OnDemandNavigationModelProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.sorting.SortableSiteMap;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

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
    private OnDemandNavigationModelProvider onDemandNavigationModelProvider;

    @Autowired
    private PublicationService publicationService;

    public String createSitemap(String contextPath, Localization localization) throws IshServiceException {
        // Workaround: Currently the content service is not returning a sitemap for Docs only content
        // so the workaround is for each publication get the entire subtree and merge the results.
        // This will cause several requests to be issued and results in quite a slow performance.

        try {
            WebSitemapGenerator sitemapGenerator = new WebSitemapGenerator(contextPath);
            NavigationFilter navigationFilter = new NavigationFilter();
            navigationFilter.setWithAncestors(false);
            navigationFilter.setDescendantLevels(-1);

            List<Publication> pubs = publicationService.getPublicationList(localization);
            for (Publication pub : pubs) {
                try {
                    Collection<SitemapItemModelData> items = getSitemapItemModelData(Integer.parseInt(pub.getId()), localization, null, null, navigationFilter);
                    generateSitemapsForCurrentLevel(pub, contextPath, sitemapGenerator, items);
                } catch (Exception e) {
                    throw new IshServiceException("Could not generate sitemap for publication " + pub.getId(), e);
                }
            }
            return String.join("", sitemapGenerator.writeAsStrings());
        } catch (Exception ex) {
            throw new IshServiceException("Could not generate sitemap for " + contextPath, ex);
        }
    }

    private void generateSitemapsForCurrentLevel(Publication pub,
                                                 String contextPath,
                                                 WebSitemapGenerator sitemapGenerator,
                                                 Collection<SitemapItemModelData> items) throws MalformedURLException {
        if (items == null || items.isEmpty()) return;
        Date currentDate = new Date();
        List<SitemapItemModelData> fixed = fixupSitemap(items, true);
        Collection<SitemapItemModelData> ordered = orderSitemapItems(fixed);
        for (SitemapItemModelData item : ordered) {
            if (!item.getItems().isEmpty()) {
                generateSitemapsForCurrentLevel(pub, contextPath, sitemapGenerator, item.getItems());
            }
            if (Strings.isNullOrEmpty(item.getUrl())) continue;
            String link = contextPath.replaceAll("(.*)/+$", "$1");
            String fixedUrl = String.join("/", link, item.getUrl());
            String fixedUrlWithouDubbedSlash = fixedUrl.replaceAll("(?<!https?:)//++", "/");

            WebSitemapUrl url = new WebSitemapUrl
                    .Options(fixedUrlWithouDubbedSlash)
                    .lastMod(item.getPublishedDate() == null ? currentDate : item.getPublishedDate().toDate())
                    .priority(1.0)
                    .changeFreq(ChangeFreq.HOURLY)
                    .build();
            sitemapGenerator.addUrl(url);
        }
    }

    private Collection<SitemapItemModelData> getSitemapItemModelData(Integer publicationId,
                                                                     Localization localization,
                                                                     String sitemapItemId,
                                                                     ClaimHolder claimHolder,
                                                                     NavigationFilter navigationFilter) {
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

    private static List<SitemapItemModelData> fixupSitemap(Collection<SitemapItemModelData> toc, boolean removePageNodes) {
        List<SitemapItemModelData> result = null;
        if (toc == null) return result;
        result = new ArrayList<>();
        for (SitemapItemModelData entry : toc) {
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

    private static Collection<SitemapItemModelData> orderSitemapItems(Collection<SitemapItemModelData> toc) {
        return SortableSiteMap.sortModelData(toc, SortableSiteMap.SORT_BY_TAXONOMY_AND_KEYWORD);
    }
}