package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.tridion.navigation.dynamic.DynamicNavigationModelProviderImpl;
import com.sdl.web.api.dynamic.taxonomies.WebTaxonomyFactory;
import com.tridion.taxonomies.Keyword;
import com.tridion.taxonomies.TaxonomyRelationManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Qualifier("ishDynamicNavigationModelProvider")
public class IshDynamicNavigationModelProvider extends DynamicNavigationModelProviderImpl {
    public IshDynamicNavigationModelProvider(WebTaxonomyFactory taxonomyFactory, TaxonomyRelationManager relationManager) {
        super(taxonomyFactory, relationManager);
    }

    @Override
    protected String getKeywordMetaUri(String taxonomyId, SitemapRequestDto requestDto, List<SitemapItemModelData> children, Keyword keyword, boolean needsToAddChildren) {
        if (keyword ==null || keyword.getKeywordMeta() == null) return "";
        Object firstValue = keyword.getKeywordMeta().getFirstValue("ish.ref.uri");
        return firstValue == null ? "" : firstValue.toString();
    }
}
