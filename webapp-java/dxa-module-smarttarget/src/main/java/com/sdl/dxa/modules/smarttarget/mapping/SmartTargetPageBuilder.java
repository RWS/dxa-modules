package com.sdl.dxa.modules.smarttarget.mapping;

import com.sdl.dxa.modules.smarttarget.model.SmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.SmartTargetRegion;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import com.sdl.webapp.tridion.mapping.PageBuilder;
import com.sdl.webapp.util.dd4t.FieldUtils;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.Page;
import org.dd4t.contentmodel.PageTemplate;
import org.dd4t.core.util.TCMURI;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import static com.google.common.base.Strings.isNullOrEmpty;
import static com.sdl.webapp.util.dd4t.TcmUtils.buildTcmUri;

@Component
@Order(1000)
@Slf4j
public class SmartTargetPageBuilder implements PageBuilder {

    private static final String PROMOTION_VIEW_NAME_CONFIG = "smarttarget.smartTargetEntityPromotion";

    @Override
    public PageModel createPage(Page page, PageModel pageModel, Localization localization, ContentProvider contentProvider) throws ContentProviderException {

        if (pageModel == null || !pageModel.getRegions().containsClass(SmartTargetRegion.class)) {
            log.debug("There are no SmartTargetRegions on the page {}", pageModel);
            return pageModel;
        }

        if (page == null || page.getPageTemplate() == null ||
                page.getPageTemplate().getMetadata() == null || !page.getPageTemplate().getMetadata().containsKey("regions")) {
            log.debug("No regions metadata found in {}", page);
            return pageModel;
        }

        SmartTargetPageModel stPageModel = new SmartTargetPageModel(pageModel).setAllowDuplicates(
                getAllowDuplicatesFromConfig(page.getPageTemplate(), localization));

        List<Object> regions = page.getPageTemplate().getMetadata().get("regions").getValues();
        for (Object region : regions) {
            if (!(region instanceof FieldSet)) {
                log.error("Expected Metadata Region to be a {} but is a {}", FieldSet.class, region.getClass());
                throw new ContentProviderException("Cannot read metadata for a region");
            }

            Map<String, Field> metadata = ((FieldSet) region).getContent();

            String regionName = FieldUtils.getStringValue(metadata.get("name"));
            if (isNullOrEmpty(regionName)) {
                regionName = MvcDataCreator.creator()
                        .fromQualifiedName(FieldUtils.getStringValue(metadata.get("view")))
                        .create()
                        .getViewName();
            }

            if (!stPageModel.containsRegion(regionName)) {
                log.debug("Page model does not contain a region {}", regionName);
                return stPageModel;
            }

            SmartTargetRegion regionModel = (SmartTargetRegion) stPageModel.getRegions().get(regionName);
            regionModel.setMaxItems(100);
            if (metadata.containsKey("maxItems")) {
                String value = FieldUtils.getStringValue(metadata.get("maxItems"));
                if (value != null) {
                    regionModel.setMaxItems(Integer.parseInt(value));
                }
            }

            executeSmartTargetQuery(stPageModel, localization);
//            ResultSet resultSet = ExecuteSmartTargetQuery(smartTargetPageModel, localization);
//            Log.Debug("SmartTarget query returned {0} Promotions.", resultSet.Promotions.Count);


            String promotionViewName = localization.getConfiguration(PROMOTION_VIEW_NAME_CONFIG);
            if (isNullOrEmpty(promotionViewName)) {
                log.warn("No view name for SmartTarget promotions is configured in CM, {}", PROMOTION_VIEW_NAME_CONFIG);
                promotionViewName = "SmartTarget:Entity:Promotion";
            }
            log.debug("Using promotion view name {}", promotionViewName);

//            ExperimentCookies existingExperimentCookies = CookieProcessor.GetExperimentCookies(HttpContext.Current.Request); // TODO: we shouldn't access HttpContext in a Model Builder.


            for (RegionModel stRegion : stPageModel.getRegions().get(SmartTargetRegion.class)) {
                String name = stRegion.getName();
//                ExperimentCookies newExperimentCookies = new ExperimentCookies();
//                ExperimentDimensions experimentDimensions;

            }

        }

        return stPageModel;
    }

    @SneakyThrows(ParseException.class)
    private List<Object> executeSmartTargetQuery(SmartTargetPageModel stPageModel, Localization localization) {
        int publicationId = Integer.parseInt(localization.getId());
        TCMURI pageUri = new TCMURI(buildTcmUri(publicationId, Integer.parseInt(stPageModel.getId()), 64));
        TCMURI publicationUri = new TCMURI(buildTcmUri(0, publicationId, 1));

        //todo implement


        return null;
    }

    private boolean getAllowDuplicatesFromConfig(PageTemplate pageTemplate, @NonNull Localization localization) {
        String allowDuplicationOnSamePage = null;
        if (pageTemplate != null && pageTemplate.getMetadata() != null
                && pageTemplate.getMetadata().containsKey("allowDuplicationOnSamePage")) {
            allowDuplicationOnSamePage = FieldUtils.getStringValue(pageTemplate.getMetadata().get("allowDuplicationOnSamePage"));
        }

        if (isNullOrEmpty(allowDuplicationOnSamePage) || allowDuplicationOnSamePage.equalsIgnoreCase("Use core configuration")) {
            allowDuplicationOnSamePage = localization.getConfiguration("smarttarget.allowDuplicationOnSamePageConfig");

            if (isNullOrEmpty(allowDuplicationOnSamePage)) {
                return true;
            }
        }

        return Boolean.parseBoolean(allowDuplicationOnSamePage);
    }
}