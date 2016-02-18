package com.sdl.dxa.modules.smarttarget.mapping;

import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetItem;
import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetRegion;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.util.dd4t.TcmUtils;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
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
import com.tridion.smarttarget.utils.CookieProcessor;
import com.tridion.smarttarget.utils.TcmUri;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator.creator;

@Component
@Slf4j
public class SmartTargetPageBuilder extends AbstractSmartTargetPageBuilder {

    @Autowired
    private WebRequestContext webRequestContext;

    @SneakyThrows(ParseException.class)
    private static ResultSet executeSmartTargetQuery(SmartTargetPageModel stPageModel) throws SmartTargetException {
        TcmUri pageUri = new TcmUri(stPageModel.getId());
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
            //noinspection ObjectAllocationInLoop
            queryBuilder.addCriteria(new RegionCriteria(region.getName()));
        }

        return queryBuilder.execute();
    }

    private static void clearFallbackContentIfNeeded(SmartTargetRegion smartTargetRegion) {
        if (!smartTargetRegion.isFallbackContentReplaced()) {
            // Discard any fallback content coming from Content Manager
            smartTargetRegion.getEntities().clear();
            // and the next time we shouldn't do it for this region because it already indeed has a ST content
            smartTargetRegion.setFallbackContentReplaced(true);
        }
    }

    private static boolean isNotPromotionToShow(SmartTargetRegion smartTargetRegion, Promotion promotion) {
        return !promotion.isVisible() || !promotion.supportsRegion(smartTargetRegion.getName());
    }

    private static void setXpmMetadataForStaging(Localization localization, final List<Promotion> promotions,
                                                 final SmartTargetRegion smartTargetRegion) {
        if (localization.isStaging()) {
            // The SmartTarget API provides the entire XPM markup tag; put it in XpmMetadata["Query"]
            HashMap<String, Object> xpmMetadata = new HashMap<>(1);
            String currentRegionName = smartTargetRegion.getName();

            xpmMetadata.put("Query",
                    ResultSetImpl.getExperienceManagerMarkup(currentRegionName, smartTargetRegion.getMaxItems(), promotions));
            smartTargetRegion.setXpmMetadata(xpmMetadata);
        }
    }

    private static boolean filterResultSet(SmartTargetPageModel stPageModel, List<Promotion> promotions, SmartTargetRegion smartTargetRegion,
                                           Map<String, ExperimentCookie> existingExperimentCookies, List<String> itemsAlreadyOnPage) {

        try {
            ResultSetImpl.filterPromotions(promotions,
                    smartTargetRegion.getName(),
                    smartTargetRegion.getMaxItems(),
                    stPageModel.isAllowDuplicates(),

                    new ArrayList<String>(),

                    itemsAlreadyOnPage,
                    existingExperimentCookies,

                    new HashMap<String, ExperimentCookie>(),
                    new ExperimentDimensions());
        } catch (SmartTargetException e) {
            log.error("Smart target exception while filtering ResultSet from ST", e);
            return false;
        }
        return true;
    }

    private static SmartTargetPromotion createPromotionEntity(final Promotion promotion, final String promotionViewName,
                                                              final String regionName, final Localization localization) throws SmartTargetException {
        SmartTargetPromotion smartTargetPromotion = new SmartTargetPromotion();
        smartTargetPromotion.setMvcData(creator()
                .defaults(DefaultsMvcData.CORE_ENTITY)
                .mergeIn(creator().fromQualifiedName(promotionViewName).create())
                .create());

        Map<String, Object> xpmMetadata = new HashMap<>(2);
        xpmMetadata.put("PromotionID", promotion.getPromotionId());
        xpmMetadata.put("RegionID", regionName);

        smartTargetPromotion.setXpmMetadata(xpmMetadata);

        smartTargetPromotion.setTitle(promotion.getTitle());
        smartTargetPromotion.setSlogan(promotion.getSlogan());

        // filter items out and convert to SmartTargetItem
        List<SmartTargetItem> smartTargetItems = new ArrayList<>(promotion.getItems().size());
        for (Item item : promotion.getItems()) {
            if (!item.isVisible()) {
                continue;
            }

            String id = String.format("%s-%s", item.getComponentUri().getItemId(), item.getTemplateUri().getItemId());

            //noinspection ObjectAllocationInLoop
            smartTargetItems.add(new SmartTargetItem(id, localization));
        }
        smartTargetPromotion.setItems(smartTargetItems);

        return smartTargetPromotion;
    }

    @Override
    protected void processQueryAndPromotions(Localization localization, SmartTargetPageModel stPageModel, String promotionViewName) {
        try {
            final ResultSet resultSet = executeSmartTargetQuery(stPageModel);

            if (resultSet == null) {
                log.warn("SmartTarget API returned null as a result for query. This can be because of timeout. Skipping processing promotions.");
                return;
            }

            @NonNull final List<Promotion> promotions;
            if (resultSet.getPromotions() == null) {
                promotions = Collections.emptyList();
            } else {
                promotions = resultSet.getPromotions();
            }

            log.debug("SmartTarget query returned {} Promotions.", promotions.size());

            // Filter the Promotions for each SmartTargetRegion
            filterPromotionsForRegion(localization, stPageModel, promotions, promotionViewName);

        } catch (SmartTargetException e) {
            log.error("Smart target exception", e);
            //todo do something more adequate
        }
    }

    private void filterPromotionsForRegion(Localization localization, SmartTargetPageModel stPageModel,
                                           final List<Promotion> promotions, String promotionViewName) throws SmartTargetException {
        // TODO: we shouldn't access ServletRequest in a Model Builder.
        Map<String, ExperimentCookie> existingExperimentCookies =
                CookieProcessor.getExperimentCookies(webRequestContext.getServletRequest());
        List<String> itemsAlreadyOnPage = new ArrayList<>();

        for (final SmartTargetRegion smartTargetRegion : stPageModel.getRegions().get(SmartTargetRegion.class)) {
            final String currentRegionName = smartTargetRegion.getName();

            if (!filterResultSet(stPageModel, promotions, smartTargetRegion, existingExperimentCookies, itemsAlreadyOnPage)) {
                continue;
            }

            setXpmMetadataForStaging(localization, promotions, smartTargetRegion);

            // Create SmartTargetPromotion Entity Models for visible Promotions in the current SmartTargetRegion.
            // It seems that ResultSet.FilterPromotions doesn't really filter on Region name, so we do post-filtering here.
            for (Promotion promotion : promotions) {
                if (isNotPromotionToShow(smartTargetRegion, promotion)) {
                    continue;
                }

                // if we found promotions in ST then we should filter fallback content out first
                clearFallbackContentIfNeeded(smartTargetRegion);

                SmartTargetPromotion smartTargetPromotion =
                        createPromotionEntity(promotion, promotionViewName, currentRegionName, localization);

                smartTargetRegion.addEntity(smartTargetPromotion);
            }
        }
    }
}
