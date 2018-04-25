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

    private static RegionModel FindRegion(RegionModelSet regionModelSet, String regionName) {
        for (RegionModel region : regionModelSet) {
            if (region.getName().equals(regionName)) {
                return region;
            }
            RegionModel childRegion = FindRegion(region.getRegions(), regionName);
            if (childRegion != null) {
                return childRegion;
            }
        }
        return null;
    }

    private static UgcRegion CreateRegion(PageModel pageModel, String areaName, String regionName) {
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
                log.error(String.format("Creation of RegionModel %s failed", regionName), e);
            }
        } else {
            ugcRegion = pageModel.getRegions().stream()
                    .filter(regionModel -> regionModel instanceof UgcRegion)
                    .map(regionModel -> (UgcRegion) regionModel)
                    .findFirst().orElse(null);
        }
        return ugcRegion;
    }

    private static void AddCommentsViews(PageModel pageModel, RegionModel region, Localization localization, RegionModel ugcRegion) {
        List<EntityModel> regionEntities = new ArrayList<>();
        for (EntityModel entity : region.getEntities()) {
            if (entity.getExtensionData() == null) {
                continue;
            }
            List<EntityModel> entities = ugcRegion != null ? ugcRegion.getEntities() : regionEntities;
            if (entity.getExtensionData().containsKey(COMMENTS_ENTITY_REGION_EXT_DATA)) {
                // comment region specified for this entity so lets find it and use that
                RegionModel targetRegion = FindRegion(pageModel.getRegions(), (String) entity.getExtensionData().get(COMMENTS_ENTITY_REGION_EXT_DATA));
                if (targetRegion != null && targetRegion != region) {
                    entities = targetRegion.getEntities();
                } else if (targetRegion == null || targetRegion == region) {
                    entities = regionEntities;
                }

                if (entity.getExtensionData().containsKey(SHOW_COMMENTS_EXT_DATA) &&
                        (boolean) entity.getExtensionData().get(SHOW_COMMENTS_EXT_DATA)) {
                    entities.add(CreateUgcCommentsEntity(localization, entity.getId(), TcmUtils.COMPONENT_ITEM_TYPE));
                }
                if (entity.getExtensionData().containsKey(POST_COMMENTS_EXT_DATA) && entity.getExtensionData().get(POST_COMMENTS_EXT_DATA) != null) {
                    entities.add(CreateUgcPostCommentEntity(localization, entity.getId(), TcmUtils.COMPONENT_ITEM_TYPE, (ContentModelData) entity.getExtensionData().get(POST_COMMENTS_EXT_DATA)));
                }
            }
        }
        // Add our ugc views to either the same region as the entity we have comments enabled for or the ugc "Comments" region if available
        regionEntities.stream().forEach(entity -> {
            region.getEntities().add(entity);
        });
        region.getRegions().stream().forEach(childRegion -> {
            AddCommentsViews(pageModel, childRegion, localization, ugcRegion);
        });
    }

    private static UgcComments CreateUgcCommentsEntity(Localization localization, String id, int componentItemType) {
        MvcData mvcData = MvcDataCreator.creator()
                .fromQualifiedName(COMMENTS_QUALIFIED_NAME)
                .defaults(DefaultsMvcData.ENTITY)
                .create();
        UgcComments model = new UgcComments();
        try {
            model.setTarget(new TCMURI(TcmUtils.buildTcmUri(localization.getId(), id, componentItemType)));
        } catch (ParseException e) {
            log.error(String.format("Unable to process  TCMURI '%s'.", TcmUtils.buildTcmUri(localization.getId(), id, componentItemType)));
        }
        model.setMvcData(mvcData);
        return model;
    }

    private static UgcPostCommentForm CreateUgcPostCommentEntity(Localization localization, String id, int componentItemType, ContentModelData postFormConfig) {
        MvcData mvcData = MvcDataCreator.creator()
                .fromQualifiedName(POST_FORM_QUALIFIED_NAME)
                .defaults(DefaultsMvcData.ENTITY)
                .create();
        UgcPostCommentForm model = new UgcPostCommentForm();
        try {
            model.setTarget(new TCMURI(TcmUtils.buildTcmUri(localization.getId(), id, componentItemType)));
        } catch (ParseException e) {
            log.error(String.format("Unable to process  TCMURI '%s'.", TcmUtils.buildTcmUri(localization.getId(), id, componentItemType)));
        }
        model.setMvcData(mvcData);
        model.setUserNameLabel(GetValue(postFormConfig, "userNameLabel", String.class));
        model.setEmailAddressLabel(GetValue(postFormConfig, "emailAddressLabel", String.class));
        model.setContentLabel(GetValue(postFormConfig, "contentLabel", String.class));
        model.setSubmitButtonLabel(GetValue(postFormConfig, "submitButtonLabel", String.class));
        model.setNoContentMessage(GetValue(postFormConfig, "noContentMessage", String.class));
        model.setNoEmailAddressMessage(GetValue(postFormConfig, "noEmailAddressMessage", String.class));
        model.setNoUserNameMessage(GetValue(postFormConfig, "noUserNameMessage", String.class));

        return model;
    }

    private static ContentModelData UgcMetadata(ContentModelData metadata) {
        return metadata == null ? null : metadata.getAndCast(COMMENTS_CONFIG, ContentModelData.class);
    }

    private static ContentModelData UgcPostFormMetadata(ContentModelData ugcMetadata) {
        return ugcMetadata == null ? null : ugcMetadata.getAndCast(POST_FORM_CONFIG, ContentModelData.class);
    }

    private static boolean ShowComments(ContentModelData ugcMetadata) {
        return GetValue(ugcMetadata, SHOW_COMMENTS_KEY, boolean.class);
    }

    private static boolean PostComments(ContentModelData ugcMetadata) {
        return GetValue(ugcMetadata, ALLOW_POST_KEY, boolean.class);
    }

    private static <T> T GetValue(ContentModelData metadata, String name, Class<T> type) {
        if (metadata == null || !metadata.containsKey(name)) {
            return null;
        }
        Object v = metadata.get(name);
        if (v == null) {
            return null;
        }
        if (type == Boolean.class) {
            //noinspection unchecked
            return (T) Boolean.valueOf("Yes");
        }
        //noinspection unchecked
        return (T) v;
    }

    @Nullable
    @Override
    public PageModel buildPageModel(@Nullable PageModel pageModel, @NotNull PageModelData modelData) {
        ContentModelData metadata = modelData.getPageTemplate() == null ? null : modelData.getPageTemplate().getMetadata();
        ContentModelData ugcMetadata = UgcMetadata(metadata);
        Localization localization = webRequestContext.getLocalization();

        String regionName = GetValue(ugcMetadata, COMMENTS_REGION_KEY, String.class);
        String areaName = pageModel.getMvcData().getAreaName();
        RegionModel ugcRegion;
        if (StringUtils.isEmpty(regionName)) {
            areaName = COMMENTS_AREA;
            regionName = COMMENTS_REGION;

            ugcRegion = FindRegion(pageModel.getRegions(), COMMENTS_REGION);
            if (ugcRegion == null) {
                CreateRegion(pageModel, areaName, regionName);
            }
        } else {
            ugcRegion = FindRegion(pageModel.getRegions(), regionName);
            if (ugcRegion == null) {
                log.error(String.format("Unable to locate region for comments '%s'.", regionName));
            }
        }

        // Entity Comments
        pageModel.getRegions().stream().forEach(region -> {
            AddCommentsViews(pageModel, region, localization, ugcRegion);
        });

        if (ugcRegion != null) {
            // Page Comments
            if (ShowComments(ugcMetadata)) {
                ugcRegion.getEntities().add(CreateUgcCommentsEntity(localization, pageModel.getId(), TcmUtils.PAGE_ITEM_TYPE));
            }
            if (PostComments(ugcMetadata)) {
                ugcRegion.getEntities().add(CreateUgcPostCommentEntity(localization, pageModel.getId(), TcmUtils.PAGE_ITEM_TYPE,
                        UgcPostFormMetadata(ugcMetadata)));
            }
        }
        return pageModel;
    }

    @Override
    public <T extends EntityModel> T buildEntityModel(@Nullable T entityModel, EntityModelData entityModelData, @Nullable Class<T> expectedClass) throws DxaException {

        ContentModelData ugcMetadata = UgcMetadata(entityModelData.getComponentTemplate().getMetadata());
        entityModel.addExtensionData(SHOW_COMMENTS_EXT_DATA, ShowComments(ugcMetadata));
        entityModel.addExtensionData(POST_COMMENTS_EXT_DATA, (PostComments(ugcMetadata) ? UgcPostFormMetadata(ugcMetadata) : null));
        entityModel.addExtensionData(COMMENTS_ENTITY_REGION_EXT_DATA, GetValue(ugcMetadata, COMMENTS_REGION_KEY, String.class));

        return entityModel;
    }

    @Override
    public int getOrder() {
        return 0;
    }


}
