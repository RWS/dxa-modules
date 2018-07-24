package com.sdl.dxa.modules.ugc.mapping;

import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.modules.ugc.data.PageIdTitleUrl;
import com.sdl.dxa.modules.ugc.model.entity.UgcComments;
import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import com.sdl.dxa.modules.ugc.model.entity.UgcRegion;
import com.sdl.dxa.tridion.mapping.EntityModelBuilder;
import com.sdl.dxa.tridion.mapping.PageModelBuilder;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.*;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.util.TCMURI;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>Builds {@linkplain PageModel Page Model} ando{@linkplain EntityModel Entity Model}.</p>
 */
@Slf4j
@Component
public class UgcModelBuilder implements PageModelBuilder, EntityModelBuilder {

    private static final String COMMENTS_CONFIG = "ugcConfig";
    private static final String POST_FORM_CONFIG = "postFormConfig";

    private static final String COMMENTS_REGION_KEY = "commentsRegion";
    private static final String SHOW_COMMENTS_KEY = "showComments";
    private static final String ALLOW_POST_KEY = "allowPost";

    private static final String COMMENTS_REGION = "Comments";
    private static final String COMMENTS_AREA = "Ugc";

    private static final String SHOW_COMMENTS_EXT_DATA = "UgcShowComments";
    private static final String POST_COMMENTS_EXT_DATA = "UgcPostComments";
    private static final String COMMENTS_ENTITY_REGION_EXT_DATA = "CommentsEntityRegion";

    private static final String COMMENTS_QUALIFIED_NAME = "Ugc:Ugc:UgcComments";
    private static final String POST_FORM_QUALIFIED_NAME = "Ugc:Ugc:UgcPostCommentForm";

    private final WebRequestContext webRequestContext;

    @Autowired
    public UgcModelBuilder(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    private RegionModel findRegion(RegionModelSet regionModelSet, String regionName) {
        for (RegionModel region : regionModelSet) {
            if (region.getName().equals(regionName)) {
                return region;
            }
            RegionModel childRegion = findRegion(region.getRegions(), regionName);
            if (childRegion != null) {
                return childRegion;
            }
        }
        return null;
    }

    private UgcRegion createRegion(PageModel pageModel, String areaName, String regionName) {
        UgcRegion ugcRegion = null;
        if (!pageModel.getRegions().containsClass(UgcRegion.class)) {
            try {
                ugcRegion = new UgcRegion(regionName);
                MvcData mvcData = MvcDataCreator.creator()
                        .fromQualifiedName(String.format("%s:%s", areaName, regionName))
                        .defaults(DefaultsMvcData.REGION)
                        .create();
                ugcRegion.setMvcData(mvcData);
                pageModel.getRegions().add(ugcRegion);
            } catch (DxaException e) {
                log.error("Creation of RegionModel {} failed", regionName, e);
            }
        } else {
            ugcRegion = pageModel.getRegions().stream()
                    .filter(regionModel -> regionModel instanceof UgcRegion)
                    .map(regionModel -> (UgcRegion) regionModel)
                    .findFirst().orElse(null);
        }
        return ugcRegion;
    }

    private void addCommentsViews(PageModel pageModel, RegionModel region, Localization localization, RegionModel ugcRegion) {
        final List<EntityModel> regionEntities = new ArrayList<>();
        for (EntityModel entity : region.getEntities()) {
            if (entity.getExtensionData() == null) {
                continue;
            }
            List<EntityModel> entities = ugcRegion != null ? ugcRegion.getEntities() : regionEntities;
            if (entity.getExtensionData().containsKey(COMMENTS_ENTITY_REGION_EXT_DATA)) {
                // comment region specified for this entity so lets find it and use that
                RegionModel targetRegion = findRegion(pageModel.getRegions(), (String) entity.getExtensionData().get(COMMENTS_ENTITY_REGION_EXT_DATA));
                if (targetRegion != null && targetRegion != region) {
                    entities = targetRegion.getEntities();
                } else if (targetRegion == null || targetRegion == region) {
                    entities = regionEntities;
                }

                if (entity.getExtensionData().containsKey(SHOW_COMMENTS_EXT_DATA) &&
                        (Boolean) entity.getExtensionData().get(SHOW_COMMENTS_EXT_DATA)) {
                    entities.add(createUgcCommentsEntity(localization, entity.getId(), TcmUtils.COMPONENT_ITEM_TYPE));
                }
                if (entity.getExtensionData().get(POST_COMMENTS_EXT_DATA) != null) {
                    PageIdTitleUrl pageIdAndTitle = new PageIdTitleUrl();
                    pageIdAndTitle.setId(entity.getId());
                    pageIdAndTitle.setUrl(pageModel.getUrl());
                    pageIdAndTitle.setTitle(pageModel.getName());

                    entities.add(createUgcPostCommentEntity(localization, pageIdAndTitle, TcmUtils.COMPONENT_ITEM_TYPE, (ContentModelData) entity.getExtensionData().get(POST_COMMENTS_EXT_DATA)));
                }
            }
        }
        // Add our ugc views to either the same region as the entity we have comments enabled for or the ugc "Comments" region if available
        regionEntities.forEach(entity -> region.getEntities().add(entity));
        region.getRegions().forEach(childRegion -> addCommentsViews(pageModel, childRegion, localization, ugcRegion));
    }

    private UgcComments createUgcCommentsEntity(Localization localization, String id, int itemType) {
        final MvcData mvcData = MvcDataCreator.creator()
                .fromQualifiedName(COMMENTS_QUALIFIED_NAME)
                .defaults(DefaultsMvcData.ENTITY)
                .create();
        final UgcComments model = new UgcComments();
        try {
            model.setTarget(new TCMURI(TcmUtils.buildTcmUri(localization.getId(), id, itemType)));
        } catch (ParseException e) {
            log.error("Unable to process  TCMURI '{}'.", TcmUtils.buildTcmUri(localization.getId(), id, itemType));
        }
        model.setMvcData(mvcData);
        return model;
    }

    private UgcPostCommentForm createUgcPostCommentEntity(Localization localization, PageIdTitleUrl pageIdTitleUrl, int itemType, ContentModelData postFormConfig) {
        final MvcData mvcData = MvcDataCreator.creator()
                .fromQualifiedName(POST_FORM_QUALIFIED_NAME)
                .defaults(DefaultsMvcData.ENTITY)
                .create();
        final UgcPostCommentForm model = new UgcPostCommentForm();
        try {
            model.setTarget(new TCMURI(TcmUtils.buildTcmUri(localization.getId(), pageIdTitleUrl.getId(), itemType)));
        } catch (ParseException e) {
            log.error("Unable to process TCMURI '{}'.", TcmUtils.buildTcmUri(localization.getId(), pageIdTitleUrl.getId(), itemType));
        }
        model.setMvcData(mvcData);
        model.setUserNameLabel(getValue(postFormConfig, "userNameLabel", String.class));
        model.setEmailAddressLabel(getValue(postFormConfig, "emailAddressLabel", String.class));
        model.setContentLabel(getValue(postFormConfig, "contentLabel", String.class));
        model.setSubmitButtonLabel(getValue(postFormConfig, "submitButtonLabel", String.class));
        model.setCancelButtonLabel(getValue(postFormConfig, "cancelButtonLabel", String.class));
        model.setNoContentMessage(getValue(postFormConfig, "noContentMessage", String.class));
        model.setNoEmailAddressMessage(getValue(postFormConfig, "noEmailAddressMessage", String.class));
        model.setNoUserNameMessage(getValue(postFormConfig, "noUserNameMessage", String.class));
        model.setPublicationId(localization.getId());
        model.setPageId(pageIdTitleUrl.getId());
        model.setPublicationTitle("Not available in Tridion Sites");
        model.setPublicationUrl("Not available in Tridion Sites");
        model.setItemTitle(pageIdTitleUrl.getTitle());
        model.setItemUrl(pageIdTitleUrl.getUrl());
        model.setLanguage(localization.getLocale().toLanguageTag());
        model.setStatus("0");

        return model;
    }

    private ContentModelData ugcMetadata(ContentModelData metadata) {
        return metadata == null ? null : metadata.getAndCast(COMMENTS_CONFIG, ContentModelData.class);
    }

    private ContentModelData ugcPostFormMetadata(ContentModelData ugcMetadata) {
        return ugcMetadata == null ? null : ugcMetadata.getAndCast(POST_FORM_CONFIG, ContentModelData.class);
    }

    private Boolean showComments(ContentModelData ugcMetadata) {
        return getValue(ugcMetadata, SHOW_COMMENTS_KEY, Boolean.class);
    }

    private Boolean postComments(ContentModelData ugcMetadata) {
        return getValue(ugcMetadata, ALLOW_POST_KEY, Boolean.class);
    }

    private <T> T getValue(ContentModelData metadata, String name, Class<T> type) {
        if (metadata == null || !metadata.containsKey(name)) {
            if (type == Boolean.class) {
                //noinspection unchecked
                return (T) (Boolean.valueOf("No"));
            }
            return null;
        }
        Object v = metadata.get(name);
        if (v == null) {
            if (type == Boolean.class) {
                //noinspection unchecked
                return (T) Boolean.FALSE;
            }
            return null;
        }
        if (type == Boolean.class) {
            //noinspection unchecked
            return (T) (v.toString().equalsIgnoreCase("yes") ? Boolean.TRUE : Boolean.FALSE);
        }
        //noinspection unchecked
        return (T) v;
    }

    /**
     * <p>Extends the pagemodel with a UGC region and entities</p>
     *
     * @param originalPageModel the strongly typed Page Model to build
     * @param modelData         the DXA R2 Data Model
     */
    @Nullable
    @Override
    public PageModel buildPageModel(@Nullable PageModel originalPageModel, @NotNull PageModelData modelData) {
        if (originalPageModel == null) {
            log.error("Original page model  is null");
            return null;
        }

        final ContentModelData metadata = modelData.getPageTemplate() == null ? null : modelData.getPageTemplate().getMetadata();
        final ContentModelData ugcMetadata = ugcMetadata(metadata);
        final Localization localization = webRequestContext.getLocalization();

        String regionName = getValue(ugcMetadata, COMMENTS_REGION_KEY, String.class);
        final RegionModel ugcRegion;
        RegionModel ugcRegionModel;
        if (StringUtils.isEmpty(regionName)) {
            ugcRegionModel = findRegion(originalPageModel.getRegions(), COMMENTS_REGION);
            if (ugcRegionModel == null) {
                ugcRegionModel = createRegion(originalPageModel, COMMENTS_AREA, COMMENTS_REGION);
            }
        } else {
            ugcRegionModel = findRegion(originalPageModel.getRegions(), regionName);
            if (ugcRegionModel == null) {
                log.error("Unable to locate region for comments '{}'.", regionName);
            }
        }

        ugcRegion = ugcRegionModel;
        originalPageModel.getRegions().forEach(region -> addCommentsViews(originalPageModel, region, localization, ugcRegion));

        if (ugcRegion != null) {
            if (showComments(ugcMetadata)) {
                ugcRegion.getEntities().add(createUgcCommentsEntity(localization, originalPageModel.getId(), TcmUtils.PAGE_ITEM_TYPE));
            }
            if (postComments(ugcMetadata)) {
                PageIdTitleUrl pageIdAndTitle = new PageIdTitleUrl();
                pageIdAndTitle.setId(originalPageModel.getId());
                pageIdAndTitle.setTitle(originalPageModel.getName());
                ugcRegion.getEntities().add(createUgcPostCommentEntity(localization, pageIdAndTitle, TcmUtils.PAGE_ITEM_TYPE,
                        ugcPostFormMetadata(ugcMetadata)));
            }
        }
        return originalPageModel;
    }

    /**
     * <p>Extends the Entity Model with Ugc extension data. Never returns null.</p>
     *
     * @param originalEntityModel the strongly typed Entity Model to build. Is null for the first Entity Model Builder in the ModelBuilderPipelineImpl
     * @param modelData           the DXA R2 Data Model
     * @param expectedClass       required class of entity model, gets the priority if modelData contains MVC data
     * @return the strongly typed Entity Model
     */
    @Override
    public <T extends EntityModel> T buildEntityModel(@Nullable T originalEntityModel, EntityModelData modelData, @Nullable Class<T> expectedClass) {
        if (modelData != null && modelData.getComponentTemplate() != null ) {
            final ContentModelData ugcMetadata = ugcMetadata(modelData.getComponentTemplate().getMetadata());
            if (ugcMetadata != null) {
                originalEntityModel.addExtensionData(SHOW_COMMENTS_EXT_DATA, showComments(ugcMetadata));
                originalEntityModel.addExtensionData(POST_COMMENTS_EXT_DATA, (postComments(ugcMetadata) ? ugcPostFormMetadata(ugcMetadata) : null));
                originalEntityModel.addExtensionData(COMMENTS_ENTITY_REGION_EXT_DATA, getValue(ugcMetadata, COMMENTS_REGION_KEY, String.class));
            }
        }
        return originalEntityModel;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getOrder() {
        return 0;
    }


}
