package com.sdl.dxa.modules.ish.providers;

import com.google.common.base.Strings;
import com.google.common.primitives.Ints;
import com.sdl.dxa.modules.ish.localization.IshLocalization;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.api.navigation.OnDemandNavigationProvider;
import com.tridion.smarttarget.entitymodel.client.YesNo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import static com.sdl.webapp.common.api.serialization.json.filter.IgnoreByNameInRequestFilter.ignoreByName;

/**
 * TocService class.
 */
@Service
@Slf4j
public class TocService {


    @Autowired
    @Qualifier("ishNavigationProvider")
    private OnDemandNavigationProvider onDemandNavigationProvider;

    public Collection<SitemapItem> getToc(Integer publicationId, String sitemapItemId, boolean includeAncestors,
                                          int descendantLevels, HttpServletRequest request,
                                          WebRequestContext webRequestContext) {
        if (onDemandNavigationProvider == null) {
            String message = "On-Demand Navigation is not enabled because current navigation provider doesn't " +
                    "support it. If you are using your own navigation provider, you should Implement " +
                    "OnDemandNavigationProvider interface, otherwise check document on how you should enable " +
                    "OnDemandNavigation.";
            log.warn(message);
            throw new UnsupportedOperationException(message);
        }

        IshLocalization localization = (IshLocalization) webRequestContext.getLocalization();
        localization.setPublicationId(Integer.toString(publicationId));

        ignoreByName(request, "XpmMetadata", "XpmPropertyMetadata");

        NavigationFilter navigationFilter = new NavigationFilter();
        navigationFilter.setWithAncestors(includeAncestors);
        navigationFilter.setDescendantLevels(descendantLevels);
        List<SitemapItem> navigationSubtree = new ArrayList(onDemandNavigationProvider.getNavigationSubtree(sitemapItemId, navigationFilter, localization));
        navigationSubtree.sort((o1, o2) -> {
            if (o1 == o2) return 0;
            if (o1 == null) return -1;
            if (o2 == null) return 1;
            //order should be t1-k2 t1-k3 t1-k10 then t2-k5 (so numbers after 'k')
            int firstPartCompareResult = getPart(YesNo.YES, o1).compareTo(getPart(YesNo.YES, o2));
            if (firstPartCompareResult != 0) return firstPartCompareResult;
            return getPart(YesNo.NO, o1).compareTo(getPart(YesNo.NO, o2));
        });
        return navigationSubtree;
    }

    private Integer getPart(YesNo firstPart, SitemapItem item) {
        return Ints.tryParse(item.getId().replaceAll("^t(\\d++)(-k(\\d++))?$", firstPart == YesNo.YES ? "$1" : "$3"));
    }
}
