package com.sdl.dxa.modules.ugc.mapping;

import com.sdl.dxa.api.datamodel.model.*;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.RegionModelSet;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelSetImpl;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class UgcModelBuilderTest {

    private static final String COMMENTS_CONFIG = "ugcConfig";
    private static final String POST_FORM_CONFIG = "postFormConfig";
    private static final String COMMENTS_REGION_KEY = "commentsRegion";
    private static final String SHOW_COMMENTS_KEY = "showComments";
    private static final String ALLOW_POST_KEY = "allowPost";
    private static final String SHOW_COMMENTS_EXT_DATA = "UgcShowComments";
    private static final String POST_COMMENTS_EXT_DATA = "UgcPostComments";
    private static final String COMMENTS_ENTITY_REGION_EXT_DATA = "CommentsEntityRegion";

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @InjectMocks
    private UgcModelBuilder builder;

    @Test
    public void shouldNotChangeEntityBecauseTemplateExtensionDataIsNullOrHasNoUgcMetadata() {
        //given
        TestEntity testEntity = new TestEntity();
        EntityModelData entityModelData = new EntityModelData();
        ComponentTemplateData componentTemplate = new ComponentTemplateData();
        ContentModelData metadata = new ContentModelData();
        entityModelData.setComponentTemplate(componentTemplate);

        //when
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Assert.assertSame(testEntity, entityR2);

        //when
        componentTemplate.setMetadata(metadata);
        entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);
        Assert.assertNull(entityR2.getExtensionData());

        //then
        Assert.assertSame(testEntity, entityR2);
        Assert.assertNull(entityR2.getExtensionData());
    }

    /**
     *
     */
    @Test
    public void shouldChangeEntity() {
        //given
        TestEntity testEntity = new TestEntity();
        EntityModelData entityModelData = getUgcEntityModelData();

        //when
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Assert.assertEquals(entityR2.getExtensionData().get(SHOW_COMMENTS_EXT_DATA), true);
        Assert.assertEquals(entityR2.getExtensionData().get(COMMENTS_ENTITY_REGION_EXT_DATA), "comment");
        Assert.assertEquals(entityR2.getExtensionData().get(POST_COMMENTS_EXT_DATA), new ContentModelData());
    }

    @Test
    public void shouldNotChangePageModel() {
        //given
        PageModel testPage = mock(PageModel.class);

        PageModelData pageModelData = new PageModelData();
        PageTemplateData pageTemplate = new PageTemplateData();
        ContentModelData metadata = new ContentModelData();
        ContentModelData ugcMetadata = new ContentModelData();
        ugcMetadata.put(COMMENTS_REGION_KEY, "comment");
        metadata.put(COMMENTS_CONFIG, ugcMetadata);

        RegionModel regionmodel = mock(RegionModelImpl.class);
        RegionModelSet regionModelSet = new RegionModelSetImpl();
        regionModelSet.add(regionmodel);

        TestEntity testEntity = new TestEntity();
        EntityModel entityR2 = builder.buildEntityModel(testEntity, getUgcEntityModelData(), null);
        ((TestEntity) entityR2).setId("2");

        List<EntityModel> regionEntities = new ArrayList<>();
        regionEntities.add(entityR2);

        pageTemplate.setMetadata(metadata);
        pageModelData.setPageTemplate(pageTemplate);

        when(webRequestContext.getLocalization()).thenReturn(localization);
        when(localization.getId()).thenReturn("1");
        when(testPage.getRegions()).thenReturn(regionModelSet);
        when(regionmodel.getEntities()).thenReturn(regionEntities);
        when(regionmodel.getRegions()).thenReturn(new RegionModelSetImpl());
        when(regionmodel.getName()).thenReturn("comment");
        when(localization.getLocale()).thenReturn(Locale.US);

        //when
        PageModel pageR2 = builder.buildPageModel(testPage, pageModelData);

        //then
        Assert.assertSame(testPage, pageR2);
        Assert.assertEquals(((RegionModel)testPage.getRegions().get(regionmodel.getClass()).toArray()[0]).getEntities().size(),3);
    }

    private EntityModelData getUgcEntityModelData() {
        EntityModelData entityModelData = new EntityModelData();
        ComponentTemplateData componentTemplate = new ComponentTemplateData();
        ContentModelData metadata = new ContentModelData();
        ContentModelData ugcMetadata = new ContentModelData();
        ContentModelData ugcPostMetadata = new ContentModelData();

        ugcMetadata.put(SHOW_COMMENTS_KEY, "yes");
        ugcMetadata.put(ALLOW_POST_KEY, "yes");
        ugcMetadata.put(COMMENTS_REGION_KEY, "comment");
        ugcMetadata.put(POST_FORM_CONFIG, ugcPostMetadata);

        metadata.put(COMMENTS_CONFIG, ugcMetadata);

        componentTemplate.setMetadata(metadata);
        entityModelData.setComponentTemplate(componentTemplate);
        return entityModelData;
    }

    private static class TestEntity extends AbstractEntityModel {

    }

}