package com.sdl.dxa.modules.smarttarget.mapping;

import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.api.datamodel.model.RegionModelData;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.dxa.tridion.mapping.PageModelBuilder;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@Component
public class SmartTargetPageBuilder extends AbstractSmartTargetPageBuilder implements PageModelBuilder {

    private final WebRequestContext webRequestContext;

    @Autowired
    public SmartTargetPageBuilder(HttpServletRequest httpServletRequest, WebRequestContext webRequestContext) {
        super(httpServletRequest);
        this.webRequestContext = webRequestContext;
    }

    @Override
    public PageModel buildPageModel(@Nullable PageModel pageModel, @NotNull PageModelData modelData) {
        if (pageModel == null || pageModel.getRegions() == null || !pageModel.getRegions().containsClass(SmartTargetRegion.class)
                || modelData.getRegions() == null) {
            log.debug("There are no SmartTargetRegions on the page {}", pageModel);
            return pageModel;
        }

        Localization localization = webRequestContext.getLocalization();

        String allowDuplicationOnSamePage = modelData.getMetadata() == null ? null :
                String.valueOf(modelData.getMetadata().get(DUPLICATION_ON_SAME_PAGE_KEY));
        SmartTargetPageModel stPageModel = new SmartTargetPageModel(pageModel)
                .setAllowDuplicates(getAllowDuplicatesFromConfig(allowDuplicationOnSamePage, localization));

        pageModel.getRegions().stream()
                .filter(regionModel -> regionModel instanceof SmartTargetRegion)
                .map(regionModel -> (SmartTargetRegion) regionModel)
                .forEach(regionModel -> {
                    RegionModelData regionModelData = modelData.getRegions().stream()
                            .filter(rmd -> rmd.getName().equals(regionModel.getName()))
                            .findFirst().orElse(null);

                    ContentModelData metadata = regionModelData == null ? null : regionModelData.getMetadata();

                    String maxItems = metadata == null ? null : metadata.getAndCast("maxItems", String.class);
                    setMaxItems(maxItems, regionModel);
                });

        String promotionViewName = getPromotionViewName(localization);
        log.debug("Using promotion view name {}", promotionViewName);

        processQueryAndPromotions(localization, stPageModel, promotionViewName);

        return stPageModel;
    }
}
