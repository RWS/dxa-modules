package com.sdl.dxa.modules.smarttarget.mapping;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.tridion.mapping.PageBuilder;
import com.sdl.webapp.util.dd4t.FieldUtils;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class SmartTargetPageBuilder extends AbstractSmartTargetPageBuilder implements PageBuilder {

    @Autowired
    public SmartTargetPageBuilder(HttpServletRequest httpServletRequest) {
        super(httpServletRequest);
    }

    @Override
    public PageModel createPage(Page page, PageModel pageModel, Localization localization, ContentProvider contentProvider)
            throws ContentProviderException {

        if (pageModel == null || pageModel.getRegions() == null || !pageModel.getRegions().containsClass(SmartTargetRegion.class)) {
            log.debug("There are no SmartTargetRegions on the page {}", pageModel);
            return pageModel;
        }

        if (page == null || page.getPageTemplate() == null ||
                page.getPageTemplate().getMetadata() == null || !page.getPageTemplate().getMetadata().containsKey("regions")) {
            log.debug("No regions metadata found in {}", page);
            return pageModel;
        }

        String allowDuplicationOnSamePage = null;
        if (page.getPageTemplate().getMetadata().containsKey(DUPLICATION_ON_SAME_PAGE_KEY)) {
            allowDuplicationOnSamePage = FieldUtils.getStringValue(page.getPageTemplate().getMetadata().get(DUPLICATION_ON_SAME_PAGE_KEY));
        }

        SmartTargetPageModel stPageModel = new SmartTargetPageModel(pageModel)
                .setAllowDuplicates(getAllowDuplicatesFromConfig(allowDuplicationOnSamePage, localization));

        List<Object> regions = page.getPageTemplate().getMetadata().get("regions").getValues();
        for (Object region : regions) {
            if (!(region instanceof FieldSet)) {
                log.error("Expected Metadata Region to be a {} but is a {}", FieldSet.class, region.getClass());
                throw new ContentProviderException("Cannot read metadata for a region");
            }

            Map<String, Field> metadata = ((FieldSet) region).getContent();

            String regionName = getViewNameForRegion(
                    FieldUtils.getStringValue(metadata.get("name")),
                    FieldUtils.getStringValue(metadata.get("view")));

            if (!(stPageModel.containsRegion(regionName) && stPageModel.getRegions().get(regionName) instanceof SmartTargetRegion)) {
                log.debug("Page model does not contain a region {} of a class {}", regionName, SmartTargetRegion.class);
                continue;
            }

            String maxItems = metadata.containsKey("maxItems") ? FieldUtils.getStringValue(metadata.get("maxItems")) : null;
            setMaxItems(maxItems, (SmartTargetRegion) stPageModel.getRegions().get(regionName));
        }

        String promotionViewName = getPromotionViewName(localization);
        log.debug("Using promotion view name {}", promotionViewName);

        processQueryAndPromotions(localization, stPageModel, promotionViewName);

        return stPageModel;
    }
}
