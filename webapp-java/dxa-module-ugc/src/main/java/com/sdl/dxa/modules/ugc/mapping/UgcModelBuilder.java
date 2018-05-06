package com.sdl.dxa.modules.ugc.mapping;

import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
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

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

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

    private final HttpServletRequest httpServletRequest;

    private final WebRequestContext webRequestContext;

    @Autowired
    public UgcModelBuilder(HttpServletRequest httpServletRequest, WebRequestContext webRequestContext) {
        this.httpServletRequest = httpServletRequest;
        this.webRequestContext = webRequestContext;
    }

    private static RegionModel findRegion(RegionModelSet regionModelSet, String regionName) {
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

    private static UgcRegion createRegion(PageModel pageModel, String areaName, String regionName) {
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

    private static void addCommentsViews(PageModel pageModel, RegionModel region, Localization localization, RegionModel ugcRegion) {
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
                if (entity.getExtensionData().containsKey(POST_COMMENTS_EXT_DATA) && entity.getExtensionData().get(POST_COMMENTS_EXT_DATA) != null) {
                    entities.add(createUgcPostCommentEntity(localization, entity.getId(), TcmUtils.COMPONENT_ITEM_TYPE, (ContentModelData) entity.getExtensionData().get(POST_COMMENTS_EXT_DATA)));
                }
            }
        }
        // Add our ugc views to either the same region as the entity we have comments enabled for or the ugc "Comments" region if available
        regionEntities.stream().forEach(entity -> {
            region.getEntities().add(entity);
        });
        region.getRegions().stream().forEach(childRegion -> {
            addCommentsViews(pageModel, childRegion, localization, ugcRegion);
        });
    }

    private static UgcComments createUgcCommentsEntity(Localization localization, String id, int itemType) {
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

    private static UgcPostCommentForm createUgcPostCommentEntity(Localization localization, String id, int itemType, ContentModelData postFormConfig) {
        final MvcData mvcData = MvcDataCreator.creator()
                .fromQualifiedName(POST_FORM_QUALIFIED_NAME)
                .defaults(DefaultsMvcData.ENTITY)
                .create();
        final UgcPostCommentForm model = new UgcPostCommentForm();
        try {
            model.setTarget(new TCMURI(TcmUtils.buildTcmUri(localization.getId(), id, itemType)));
        } catch (ParseException e) {
            log.error("Unable to process  TCMURI '{}'.", TcmUtils.buildTcmUri(localization.getId(), id, itemType));
        }
        model.setMvcData(mvcData);
        model.setUserNameLabel(getValue(postFormConfig, "userNameLabel", String.class));
        model.setEmailAddressLabel(getValue(postFormConfig, "emailAddressLabel", String.class));
        model.setContentLabel(getValue(postFormConfig, "contentLabel", String.class));
        model.setSubmitButtonLabel(getValue(postFormConfig, "submitButtonLabel", String.class));
        model.setNoContentMessage(getValue(postFormConfig, "noContentMessage", String.class));
        model.setNoEmailAddressMessage(getValue(postFormConfig, "noEmailAddressMessage", String.class));
        model.setNoUserNameMessage(getValue(postFormConfig, "noUserNameMessage", String.class));

        return model;
    }

    private static ContentModelData ugcMetadata(ContentModelData metadata) {
        return metadata == null ? null : metadata.getAndCast(COMMENTS_CONFIG, ContentModelData.class);
    }

    private static ContentModelData ugcPostFormMetadata(ContentModelData ugcMetadata) {
        return ugcMetadata == null ? null : ugcMetadata.getAndCast(POST_FORM_CONFIG, ContentModelData.class);
    }

    private static Boolean showComments(ContentModelData ugcMetadata) {
        return getValue(ugcMetadata, SHOW_COMMENTS_KEY, Boolean.class);
    }

    private static Boolean postComments(ContentModelData ugcMetadata) {
        return getValue(ugcMetadata, ALLOW_POST_KEY, Boolean.class);
    }

    private static <T> T getValue(ContentModelData metadata, String name, Class<T> type) {
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
            }return null;
        }
        if (type == Boolean.class) {
            //noinspection unchecked
            return (T) (v.toString().equalsIgnoreCase("yes")? Boolean.TRUE:Boolean.FALSE);
        }
        //noinspection unchecked
        return (T) v;
    }

    @Nullable
    @Override
    public PageModel buildPageModel(@Nullable PageModel pageModel, @NotNull PageModelData modelData) {
        final ContentModelData metadata = modelData.getPageTemplate() == null ? null : modelData.getPageTemplate().getMetadata();
        final ContentModelData ugcMetadata = ugcMetadata(metadata);
        final Localization localization = webRequestContext.getLocalization();

        String regionName = getValue(ugcMetadata, COMMENTS_REGION_KEY, String.class);
        String areaName = pageModel.getMvcData().getAreaName();
        final RegionModel ugcRegion;RegionModel ugcRegion1;
        if (StringUtils.isEmpty(regionName)) {
            areaName = COMMENTS_AREA;
            regionName = COMMENTS_REGION;

            ugcRegion1 = findRegion(pageModel.getRegions(), COMMENTS_REGION);
            if (ugcRegion1 == null) {
                ugcRegion1 = createRegion(pageModel, areaName, regionName);
            }
        } else {
            ugcRegion1 = findRegion(pageModel.getRegions(), regionName);
            if (ugcRegion1 == null) {
                log.error("Unable to locate region for comments '{}'.", regionName);
            }
        }

        // Entity Comments
        ugcRegion = ugcRegion1;
        pageModel.getRegions().stream().forEach(region -> {
            addCommentsViews(pageModel, region, localization, ugcRegion);
        });

        if (ugcRegion != null) {
            // Page Comments
            if (showComments(ugcMetadata)) {
                ugcRegion.getEntities().add(createUgcCommentsEntity(localization, pageModel.getId(), TcmUtils.PAGE_ITEM_TYPE));
            }
            if (postComments(ugcMetadata)) {
                ugcRegion.getEntities().add(createUgcPostCommentEntity(localization, pageModel.getId(), TcmUtils.PAGE_ITEM_TYPE,
                        ugcPostFormMetadata(ugcMetadata)));
            }
        }
        return pageModel;
    }

    @Override
    public <T extends EntityModel> T buildEntityModel(@Nullable T entityModel, EntityModelData entityModelData, @Nullable Class<T> expectedClass) throws DxaException {

        final ContentModelData ugcMetadata = ugcMetadata(entityModelData.getComponentTemplate().getMetadata());
        if (ugcMetadata != null) {
                entityModel.addExtensionData(SHOW_COMMENTS_EXT_DATA, showComments(ugcMetadata));
            entityModel.addExtensionData(POST_COMMENTS_EXT_DATA, (postComments(ugcMetadata) ? ugcPostFormMetadata(ugcMetadata) : null));
            entityModel.addExtensionData(COMMENTS_ENTITY_REGION_EXT_DATA, getValue(ugcMetadata, COMMENTS_REGION_KEY, String.class));
        }
        return entityModel;
    }

    @Override
    public int getOrder() {
        return 0;
    }


}
