package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.tridion.navigation.dynamic.NavigationModelProvider;
import com.sdl.dxa.tridion.navigation.dynamic.OnDemandNavigationModelProvider;
import com.sdl.webapp.common.api.content.LinkResolver;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.api.navigation.TaxonomyUrisHolder;
import com.sdl.webapp.common.controller.exception.BadRequestException;
import com.sdl.webapp.tridion.navigation.DynamicNavigationProvider;
import com.sdl.webapp.tridion.navigation.StaticNavigationProvider;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Collection;

import static com.sdl.webapp.common.api.navigation.TaxonomyUrisHolder.parse;

/**
 * IshDynamicNavigationProvider class.
 */
@Primary
@Service("ishNavigationProvider")
@Slf4j
public class IshDynamicNavigationProvider extends DynamicNavigationProvider {

    @Value("${dxa.tridion.navigation.taxonomy.type.taxonomyNode}")
    protected String sitemapItemTypeTaxonomyNode;

    @Autowired
    public IshDynamicNavigationProvider(StaticNavigationProvider staticNavigationProvider,
                                        LinkResolver linkResolver,
                                        NavigationModelProvider navigationModelProvider,
                                        OnDemandNavigationModelProvider onDemandNavigationModelProvider) {
        super(staticNavigationProvider, linkResolver, navigationModelProvider, onDemandNavigationModelProvider);
    }

    @Override
    public Collection<SitemapItem> getNavigationSubtree(@Nullable String sitemapItemId,
                                                        @NonNull NavigationFilter navigationFilter,
                                                        @NonNull Localization localization) {
        Collection<SitemapItem> items = super.getNavigationSubtree(sitemapItemId, navigationFilter, localization);
        if (items.isEmpty()) {
            TaxonomyUrisHolder info = parse(sitemapItemId, localization.getId());
            if (info == null) {
                throw new BadRequestException("SitemapID " + sitemapItemId +
                        " format is wrong for Taxonomy navigation");
            }
            if (info.isPage()) {
                throw new BadRequestException("Page ids cannot be processed");
            }
        }
        return items;
    }
}
