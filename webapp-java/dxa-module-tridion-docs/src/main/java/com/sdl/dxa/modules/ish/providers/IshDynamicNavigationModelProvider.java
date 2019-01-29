package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.api.datamodel.model.TaxonomyNodeModelData;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.tridion.navigation.dynamic.DynamicNavigationModelProviderImpl;
import com.sdl.web.api.dynamic.taxonomies.WebTaxonomyFactory;
import com.tridion.taxonomies.TaxonomyFactory;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.taxonomies.Keyword;
import com.tridion.taxonomies.TaxonomyRelationManager;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.SortedSet;

import static com.sdl.dxa.common.util.PathUtils.stripDefaultExtension;
import static com.sdl.webapp.common.util.TcmUtils.Taxonomies.SitemapItemType.KEYWORD;
import static com.sdl.webapp.common.util.TcmUtils.Taxonomies.getTaxonomySitemapIdentifier;

@Service("ishDynamicNavigationModelProvider")
public class IshDynamicNavigationModelProvider extends DynamicNavigationModelProviderImpl {
    public IshDynamicNavigationModelProvider(TaxonomyFactory taxonomyFactory, TaxonomyRelationManager relationManager) {
        super(taxonomyFactory, relationManager);
    }

    @Override
    protected String getKeywordMetaUri(String taxonomyId, SitemapRequestDto requestDto, List<SitemapItemModelData> children, Keyword keyword, boolean needsToAddChildren) {
        if (keyword == null || keyword.getKeywordMeta() == null) return "";
        Object firstValue = keyword.getKeywordMeta().getFirstValue("ish.ref.uri");
        return firstValue == null ? "" : firstValue.toString().replaceAll("\\D+:(\\d++)-(\\d++)-\\d++", "$1/$2");
    }

    @Override
    protected TaxonomyNodeModelData createTaxonomyNodeFromKeyword(@NotNull Keyword keyword, String taxonomyId, String taxonomyNodeUrl, SortedSet<SitemapItemModelData> children) {
        boolean isRoot = Objects.equals(keyword.getTaxonomyURI(), keyword.getKeywordURI());
        String keywordId = String.valueOf(TcmUtils.getItemId(keyword.getKeywordURI()));

        return (TaxonomyNodeModelData) new TaxonomyNodeModelData()
                .setWithChildren(keyword.hasKeywordChildren() || keyword.getReferencedContentCount() > 0)
                .setDescription(keyword.getKeywordDescription())
                .setTaxonomyAbstract(keyword.isKeywordAbstract())
                .setClassifiedItemsCount(keyword.getReferencedContentCount())
                .setKey(keyword.getKeywordKey())
                .setId(isRoot ? getTaxonomySitemapIdentifier(taxonomyId) : getTaxonomySitemapIdentifier(taxonomyId, KEYWORD, keywordId))
                .setType(sitemapItemTypeTaxonomyNode)
                .setUrl(stripDefaultExtension(taxonomyNodeUrl))
                .setTitle(keyword.getKeywordName())
                .setVisible(true)
                .setItems(children);
    }
}
