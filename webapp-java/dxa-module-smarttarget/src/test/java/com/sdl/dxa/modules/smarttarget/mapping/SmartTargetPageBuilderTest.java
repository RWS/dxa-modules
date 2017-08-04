package com.sdl.dxa.modules.smarttarget.mapping;

import com.google.common.collect.Lists;
import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.api.datamodel.model.RegionModelData;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelSetImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collections;

import static org.junit.Assert.assertNull;

@RunWith(MockitoJUnitRunner.class)
public class SmartTargetPageBuilderTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @Spy
    @InjectMocks
    private SmartTargetPageBuilder pageBuilder;

    @SuppressWarnings("Duplicates")
    private static PageModel createPageModel(RegionModel... regionModels) throws DxaException {
        PageModel pageModel = new DefaultPageModel();

        RegionModelSetImpl regionModelSet = new RegionModelSetImpl();
        Collections.addAll(regionModelSet, regionModels);
        pageModel.setRegions(regionModelSet);

        return pageModel;
    }

    @Before
    public void init() {
        Mockito.when(webRequestContext.getLocalization()).thenReturn(localization);
        Mockito.when(localization.getId()).thenReturn("1");
    }

    @Test
    public void shouldReturnNullIfPageModelIsNull() throws ContentProviderException {
        //when, then
        //noinspection ConstantConditions
        assertNull(pageBuilder.buildPageModel(null, new PageModelData("", null, null, null, null, null)));
    }

    @Test
    public void shouldNotChangePageModelWithoutSTRegionsOnPage() throws DxaException {
        //given
        PageModel pageModel = createPageModel(new RegionModelImpl("test"));

        PageModel expected = createPageModel(new RegionModelImpl("test"));

        //when
        PageModel page2 = pageBuilder.buildPageModel(pageModel, new PageModelData("", null, null, null, null, null));

        //then
        Assert.assertEquals(expected, pageModel);
        Assert.assertEquals(expected, page2);
    }

    @Test
    public void shouldCallSubclassForSmartTargetAndProcessMetadata() throws DxaException {
        shouldCallSubclassForSmartTargetAndProcessMetadata_R2("42");

        //TSI-2168 SmartTarget Module tests fail with NumberFormatException for input string
        shouldCallSubclassForSmartTargetAndProcessMetadata_R2("42.0");
    }

    @Test
    public void shouldNotChangePageModelWithoutRegionsMetadata() throws DxaException {
        //given
        PageModel pageModel = createPageModel(new SmartTargetRegion("test"));
        PageModel expected = createPageModel(new SmartTargetRegion("test"));

        //when
        PageModel pageR2 = pageBuilder.buildPageModel(pageModel, new PageModelData("", null, null, null, null, ""));

        //then
        Assert.assertEquals(expected, pageModel);
        Assert.assertEquals(expected, pageR2);
    }

    private void shouldCallSubclassForSmartTargetAndProcessMetadata_R2(String maxItemsValue) throws DxaException {
        //given
        SmartTargetRegion smartTargetRegion = new SmartTargetRegion("test");
        PageModel pageModel = createPageModel(smartTargetRegion);
        RegionModelData regionModelData = RegionModelData.builder().name("test").metadata(new ContentModelData() {{
            put("maxItems", maxItemsValue);
        }}).build();
        PageModelData pageModelData = new PageModelData("id", Collections.emptyMap(), null, "title", Lists.newArrayList(regionModelData), "");

        SmartTargetPageModel stPageModel = Mockito.mock(SmartTargetPageModel.class);
        Mockito.when(stPageModel.setAllowDuplicates(Matchers.anyBoolean())).thenReturn(stPageModel);
        Mockito.when(stPageModel.containsRegion(Matchers.eq("test"))).thenReturn(true);
        Mockito.when(stPageModel.getRegions()).thenReturn(pageModel.getRegions());

        Mockito.doNothing().when(pageBuilder).processQueryAndPromotions(Matchers.any(Localization.class), Matchers.any(SmartTargetPageModel.class), Matchers.anyString());

        //when
        SmartTargetPageModel page = ((SmartTargetPageModel) pageBuilder.buildPageModel(pageModel, pageModelData));

        //then
        Assert.assertEquals(42, smartTargetRegion.getMaxItems());
        Mockito.verify(pageBuilder).processQueryAndPromotions(Matchers.eq(localization), Matchers.eq(page), Matchers.eq("SmartTarget:Entity:Promotion"));
    }
}