package com.sdl.dxa.modules.ish.providers;

import com.google.common.base.Strings;
import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.api.datamodel.model.TaxonomyNodeModelData;
import com.sdl.dxa.common.dto.DepthCounter;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.tridion.navigation.dynamic.NavigationModelProvider;
import com.sdl.dxa.tridion.navigation.dynamic.OnDemandNavigationModelProvider;
import com.sdl.webapp.common.api.content.LinkResolver;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.model.entity.TaxonomyNode;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.api.navigation.TaxonomyUrisHolder;
import com.sdl.webapp.common.controller.exception.BadRequestException;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import com.sdl.webapp.tridion.fields.exceptions.TaxonomyNotFoundException;
import com.sdl.webapp.tridion.navigation.StaticNavigationProvider;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.sdl.webapp.common.api.navigation.TaxonomyUrisHolder.parse;

/**
 * IshDynamicNavigationProvider class.
 */
@Service("ishNavigationProvider")
@Slf4j
public class IshDynamicNavigationProvider {

    private final StaticNavigationProvider staticNavigationProvider;

    private final NavigationModelProvider navigationModelProvider;

    private final OnDemandNavigationModelProvider onDemandNavigationModelProvider;

    private final LinkResolver linkResolver;

    @Autowired
    public IshDynamicNavigationProvider(StaticNavigationProvider staticNavigationProvider,
                                        LinkResolver linkResolver,
                                        NavigationModelProvider navigationModelProvider,
                                        @Qualifier("ishDynamicNavigationModelProvider")
                                                OnDemandNavigationModelProvider onDemandNavigationModelProvider) {
        this.staticNavigationProvider = staticNavigationProvider;
        this.linkResolver = linkResolver;
        this.navigationModelProvider = navigationModelProvider;
        this.onDemandNavigationModelProvider = onDemandNavigationModelProvider;
    }

    public Collection<SitemapItem> getNavigationSubtree(@Nullable String sitemapItemId,
                                                        @NonNull NavigationFilter navigationFilter,
                                                        @NonNull Localization localization) throws DxaItemNotFoundException {
        Optional<Collection<SitemapItemModelData>> subtree;
        SitemapRequestDto requestDto = SitemapRequestDto
                .builder(Integer.parseInt(localization.getId()))
                .navigationFilter(navigationFilter)
                .expandLevels(new DepthCounter(navigationFilter.getDescendantLevels()))
                .sitemapId(sitemapItemId)
                .build();

        subtree = onDemandNavigationModelProvider.getNavigationSubtree(requestDto);

        if (!subtree.isPresent()) {
            throw new TaxonomyNotFoundException("Keyword '" + requestDto.getSitemapId() + "' in publication '" + requestDto.getLocalizationId() + "' was not found.");
        }

        Collection<SitemapItem> items = subtree.get().stream()
                .map(this::_convert)
                .collect(Collectors.toList());

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

    @NotNull
    private SitemapItem _convert(@NotNull SitemapItemModelData model) {
        SitemapItem item = _instantiateSitemap(model);
        item.setId(model.getId());
        item.setVisible(model.isVisible());
        if (!Strings.isNullOrEmpty(model.getUrl())) item.setUrl("/" + model.getUrl().replaceAll("^/?(.*)", "$1"));
        item.setTitle(model.getTitle());
        item.setOriginalTitle(model.getOriginalTitle());
        item.setPublishedDate(model.getPublishedDate());
        item.setType(model.getType());
        model.getItems().forEach(modelData -> item.addItem(_convert(modelData)));
        return item;
    }

    @NotNull
    private SitemapItem _instantiateSitemap(@NotNull SitemapItemModelData model) {
        if (model instanceof TaxonomyNodeModelData) {
            TaxonomyNodeModelData taxonomyModel = (TaxonomyNodeModelData) model;
            TaxonomyNode item = new TaxonomyNode();
            item.setKey(taxonomyModel.getKey());
            item.setClassifiedItemsCount(taxonomyModel.getClassifiedItemsCount());
            item.setDescription(taxonomyModel.getDescription());
            item.setTaxonomyAbstract(taxonomyModel.isTaxonomyAbstract());
            item.setWithChildren(taxonomyModel.isWithChildren());
            return item;
        } else {
            return new SitemapItem();
        }
    }
}
