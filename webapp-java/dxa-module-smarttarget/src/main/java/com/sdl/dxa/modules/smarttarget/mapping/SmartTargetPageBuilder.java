package com.sdl.dxa.modules.smarttarget.mapping;

import com.google.common.base.Strings;
import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.api.datamodel.model.RegionModelData;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetExperiment;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetItem;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.dxa.modules.smarttarget.utils.CookieProcessor;
import com.sdl.dxa.tridion.mapping.PageModelBuilder;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import com.tridion.smarttarget.query.Experiment;
import com.tridion.smarttarget.query.ExperimentCookie;
import com.tridion.smarttarget.query.Item;
import com.tridion.smarttarget.query.Promotion;
import com.tridion.smarttarget.query.ResultSet;
import com.tridion.smarttarget.query.ResultSetImpl;
import com.tridion.smarttarget.query.builder.PageCriteria;
import com.tridion.smarttarget.query.builder.PublicationCriteria;
import com.tridion.smarttarget.query.builder.QueryBuilder;
import com.tridion.smarttarget.query.builder.RegionCriteria;
import com.tridion.smarttarget.utils.AmbientDataHelper;
import com.tridion.smarttarget.utils.TcmUri;
import lombok.Builder;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.*;

@Slf4j
@Component
public class SmartTargetPageBuilder implements Ordered, PageModelBuilder {

    private static final String DUPLICATION_ON_SAME_PAGE_KEY = "allowDuplicationOnSamePage";

    private static final String PROMOTION_VIEW_NAME_CONFIG = "smarttarget.smartTargetEntityPromotion";

    private final HttpServletRequest httpServletRequest;

    private final WebRequestContext webRequestContext;

    @Autowired
    public SmartTargetPageBuilder(HttpServletRequest httpServletRequest, WebRequestContext webRequestContext) {
        this.httpServletRequest = httpServletRequest;
        this.webRequestContext = webRequestContext;
    }

    private static void setMaxItems(String maxItems, SmartTargetRegion regionModel) {
        regionModel.setMaxItems(100);
        if (maxItems != null) {
            regionModel.setMaxItems((int) Double.parseDouble(maxItems));
        }
    }

    private static String getPromotionViewName(Localization localization) {
        String promotionViewName = localization.getConfiguration(PROMOTION_VIEW_NAME_CONFIG);
        if (Strings.isNullOrEmpty(promotionViewName)) {
            log.warn("No view name for SmartTarget promotions is configured in CM, {}", PROMOTION_VIEW_NAME_CONFIG);
            promotionViewName = "SmartTarget:Entity:Promotion";
        }
        return promotionViewName;
    }

    private static ExperimentDimensions getExperimentDimensions(Localization localization, SmartTargetPageModel stPageModel, String currentRegionName) {
        ExperimentDimensions experimentDimensions = new ExperimentDimensions();
        experimentDimensions.setPublicationId(TcmUtils.buildPublicationTcmUri(localization.getId()));
        experimentDimensions.setPageId(TcmUtils.buildPageTcmUri(localization.getId(), stPageModel.getId()));
        experimentDimensions.setRegion(currentRegionName);
        return experimentDimensions;
    }

    private static void setXpmMetadataForStaging(Localization localization, String query, final SmartTargetRegion smartTargetRegion) {
        if (localization.isStaging()) {
            // The SmartTarget API provides the entire XPM markup tag; put it in XpmMetadata["Query"]
            Map<String, Object> xpmMetadata = new HashMap<>(1);

            xpmMetadata.put("Query", query);
            smartTargetRegion.setXpmMetadata(xpmMetadata);
        }
    }

    private static boolean isPromotionToSkip(SmartTargetRegion smartTargetRegion, Promotion promotion) {
        return !promotion.isVisible() || !promotion.supportsRegion(smartTargetRegion.getName());
    }

    private static void clearFallbackContentIfNeeded(SmartTargetRegion smartTargetRegion) {
        if (!smartTargetRegion.isFallbackContentReplaced()) {
            // Discard any fallback content coming from Content Manager
            smartTargetRegion.setEntities(new ArrayList<>());
            // and the next time we shouldn't do it for this region because it already indeed has a ST content
            smartTargetRegion.setFallbackContentReplaced(true);
        }
    }

    private static SmartTargetPromotion createPromotionEntity(final Promotion promotion, final String promotionViewName,
                                                              final String regionName, ExperimentDimensions experimentDimensions,
                                                              final Localization localization) throws SmartTargetException {

        SmartTargetPromotion smartTargetPromotion = promotion instanceof Experiment ?
                new SmartTargetExperiment(experimentDimensions) : new SmartTargetPromotion();

        smartTargetPromotion.setMvcData(MvcDataCreator.creator()
                .defaults(DefaultsMvcData.ENTITY)
                .mergeIn(MvcDataCreator.creator().fromQualifiedName(promotionViewName).create())
                .create());

        Map<String, Object> xpmMetadata = new HashMap<>(2);
        xpmMetadata.put("PromotionID", promotion.getPromotionId());
        xpmMetadata.put("RegionID", regionName);

        smartTargetPromotion.setXpmMetadata(xpmMetadata);

        smartTargetPromotion.setTitle(promotion.getTitle());
        smartTargetPromotion.setSlogan(promotion.getSlogan());
        smartTargetPromotion.setId(promotion.getPromotionId());

        // filter items out and convert to SmartTargetItem
        List<SmartTargetItem> smartTargetItems = new ArrayList<>(promotion.getItems().size());
        for (Item item : promotion.getItems()) {
            if (!item.isVisible()) {
                continue;
            }

            int itemId = item.getComponentUri().getItemId();
            String id = String.format("%s-%s", itemId, item.getTemplateUri().getItemId());

            smartTargetItems.add(new SmartTargetItem(id, localization));
        }
        smartTargetPromotion.setItems(smartTargetItems);

        return smartTargetPromotion;
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

    private boolean getAllowDuplicatesFromConfig(String allowDuplicationOnSamePage, @NonNull Localization localization) {
        String _allowDuplicationOnSamePage = allowDuplicationOnSamePage;
        if (StringUtils.isEmpty(_allowDuplicationOnSamePage) ||
                "Use core configuration".equalsIgnoreCase(_allowDuplicationOnSamePage)) {
            _allowDuplicationOnSamePage = localization.getConfiguration("smarttarget.allowDuplicationOnSamePageConfig");

            if (Strings.isNullOrEmpty(_allowDuplicationOnSamePage)) {
                return true;
            }
        }

        return Boolean.parseBoolean(_allowDuplicationOnSamePage);
    }

    String getViewNameForRegion(String regionName, String viewName) {
        return Strings.isNullOrEmpty(regionName) ? MvcDataCreator.creator()
                .fromQualifiedName(viewName)
                .create()
                .getViewName() : regionName;
    }

    private boolean filterResultSet(SmartTargetPageModel stPageModel, List<Promotion> promotions,
                                    SmartTargetRegion smartTargetRegion, List<String> itemsAlreadyOnPage,
                                    ExperimentDimensions experimentDimensions, ExperimentCookies experimentCookies) {
        try {
            ResultSetImpl.filterPromotions(promotions,
                    smartTargetRegion.getName(),
                    smartTargetRegion.getMaxItems(),
                    stPageModel.isAllowDuplicates(),

                    new ArrayList<>(),

                    itemsAlreadyOnPage,
                    experimentCookies.existingCookies,
                    experimentCookies.newCookies,

                    experimentDimensions);
        } catch (SmartTargetException e) {
            log.error("Smart target exception while filtering ResultSet from ST", e);
            return false;
        }
        return true;
    }

    @SneakyThrows(ParseException.class)
    void processQueryAndPromotions(Localization localization, SmartTargetPageModel stPageModel, String promotionViewName) {
        try {
            TcmUri pageUri = new TcmUri(TcmUtils.buildPageTcmUri(localization.getId(), stPageModel.getId()));

            ResultSet resultSet = executeSmartTargetQuery(stPageModel, pageUri);

            if (resultSet == null) {
                log.warn("SmartTarget API returned null as a result for query. This can be because of timeout.");
                resultSet = new ResultSetImpl();
            }

            @NonNull final List<Promotion> promotions;
            if (resultSet.getPromotions() == null) {
                promotions = Collections.emptyList();
            } else {
                promotions = resultSet.getPromotions();
            }

            log.debug("SmartTarget query returned {} Promotions.", promotions.size());

            // Filter the Promotions for each SmartTargetRegion
            filterPromotionsForPage(localization, stPageModel, promotions, promotionViewName);

        } catch (SmartTargetException e) {
            log.error("Smart target exception", e);
        }
    }

    @SneakyThrows(ParseException.class)
    ResultSet executeSmartTargetQuery(SmartTargetPageModel stPageModel, final TcmUri pageUri) throws SmartTargetException {
        TcmUri publicationUri = new TcmUri(TcmUtils.buildPublicationTcmUri(pageUri.getPublicationId()));

        ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
        String triggers = AmbientDataHelper.getTriggers(claimStore);

        QueryBuilder queryBuilder = new QueryBuilder();
        queryBuilder.parseQueryString(triggers);
        queryBuilder
                .addCriteria(new PublicationCriteria(publicationUri))
                .addCriteria(new PageCriteria(pageUri));

        // Adding all the page regions to the query for having only 1 query a page
        for (SmartTargetRegion region : stPageModel.getRegions().get(SmartTargetRegion.class)) {
            queryBuilder.addCriteria(new RegionCriteria(region.getName()));
        }

        return queryBuilder.execute();
    }

    private void filterPromotionsForPage(Localization localization, SmartTargetPageModel stPageModel,
                                         final List<Promotion> promotions, String promotionViewName) throws SmartTargetException {
        // TODO: we shouldn't access ServletRequest in a Model Builder.
        Map<String, ExperimentCookie> existingExperimentCookies = CookieProcessor.getExperimentCookies(httpServletRequest);
        Map<String, ExperimentCookie> newExperimentCookies = new HashMap<>();

        List<String> itemsAlreadyOnPage = new ArrayList<>();

        Set<SmartTargetRegion> smartTargetRegions = stPageModel.getRegions().get(SmartTargetRegion.class);
        if (smartTargetRegions != null) {
            for (final SmartTargetRegion smartTargetRegion : smartTargetRegions) {
                final String currentRegionName = smartTargetRegion.getName();
                ExperimentDimensions experimentDimensions = getExperimentDimensions(localization, stPageModel, currentRegionName);

                if (!filterResultSet(stPageModel, promotions, smartTargetRegion, itemsAlreadyOnPage, experimentDimensions,
                        ExperimentCookies.builder().newCookies(newExperimentCookies)
                                .existingCookies(existingExperimentCookies).build())) {
                    return;
                }

                setXpmMetadataForStaging(localization,
                        ResultSetImpl.getExperienceManagerMarkup(currentRegionName, smartTargetRegion.getMaxItems(), promotions), smartTargetRegion);

                // Create SmartTargetPromotion Entity Models for visible Promotions in the current SmartTargetRegion.
                // It seems that ResultSet.FilterPromotions doesn't really filter on Region name, so we do post-filtering here.
                for (Promotion promotion : promotions) {
                    if (isPromotionToSkip(smartTargetRegion, promotion)) {
                        continue;
                    }

                    // if we found promotions in ST then we should filter fallback content out first
                    clearFallbackContentIfNeeded(smartTargetRegion);

                    SmartTargetPromotion promotionEntity = createPromotionEntity(promotion, promotionViewName,
                            currentRegionName, experimentDimensions, localization);
                    smartTargetRegion.addEntity(promotionEntity);
                }
            }
        }

        stPageModel.setNewExperimentCookies(newExperimentCookies);
    }

    @Override
    public int getOrder() {
        return 1000;
    }

    @Builder
    private static class ExperimentCookies {

        Map<String, ExperimentCookie> existingCookies;

        Map<String, ExperimentCookie> newCookies;
    }
}
