package com.sdl.dxa.modules.smarttarget.mapping;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
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
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.Page;
import org.dd4t.contentmodel.impl.EmbeddedField;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.contentmodel.impl.PageTemplateImpl;
import org.dd4t.contentmodel.impl.TextField;
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
import java.util.HashMap;

import static junit.framework.TestCase.assertNull;

@RunWith(MockitoJUnitRunner.class)
public class SmartTargetPageBuilderTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @Spy
    @InjectMocks
    private SmartTargetPageBuilder pageBuilder;

    @Before
    public void init() {
        Mockito.when(webRequestContext.getLocalization()).thenReturn(localization);
        Mockito.when(localization.getId()).thenReturn("1");
    }

    @Test
    public void shouldReturnNullIfPageModelIsNull() throws ContentProviderException {
        //when, then
        assertNull(pageBuilder.createPage(null, null, null, null));
    }

    @Test
    public void shouldNotChangePageModelWithoutSTRegionsOnPage() throws DxaException {
        //given
        PageModel pageModel = createPageModel(new RegionModelImpl("test"));

        PageModel expected = createPageModel(new RegionModelImpl("test"));

        //when
        PageModel page = pageBuilder.createPage(null, pageModel, null, null);

        //then
        Assert.assertEquals(expected, pageModel);
        Assert.assertEquals(expected, page);
    }

    @SuppressWarnings("Duplicates")
    private static PageModel createPageModel(RegionModel... regionModels) throws DxaException {
        PageModel pageModel = new DefaultPageModel();

        RegionModelSetImpl regionModelSet = new RegionModelSetImpl();
        Collections.addAll(regionModelSet, regionModels);
        pageModel.setRegions(regionModelSet);

        return pageModel;
    }

    @Test
    public void shouldCallSubclassForSmartTargetAndProcessMetadata() throws DxaException {
        shouldCallSubclassForSmartTargetAndProcessMetadata("42");

        //TSI-2168 SmartTarget Module tests fail with NumberFormatException for input string
        shouldCallSubclassForSmartTargetAndProcessMetadata("42.0");
    }

    /**
     * The basic-flow call of the main method.
     */
    private void shouldCallSubclassForSmartTargetAndProcessMetadata(String maxItemsValue) throws DxaException {
        //given
        SmartTargetRegion smartTargetRegion = new SmartTargetRegion("test");
        PageModel pageModel = createPageModel(smartTargetRegion);
        Page dd4tPage = new PageImpl();

        PageTemplateImpl pageTemplate = new PageTemplateImpl();

        Field regions = Mockito.mock(Field.class);
        FieldSet fieldSet = Mockito.mock(FieldSet.class);
        Mockito.doReturn(Lists.newArrayList(fieldSet)).when(regions).getValues();

        Mockito.doReturn(new HashMap<String, Field>() {{
            TextField name = new TextField();
            name.setTextValues(Lists.newArrayList("test"));
            put("name", name);

            TextField maxItems = new TextField();
            maxItems.setTextValues(Lists.newArrayList(maxItemsValue));
            put("maxItems", maxItems);
        }}).when(fieldSet).getContent();

        pageTemplate.setMetadata(new HashMap<String, Field>() {{
            put("regions", regions);
        }});

        dd4tPage.setPageTemplate(pageTemplate);

        SmartTargetPageModel stPageModel = Mockito.mock(SmartTargetPageModel.class);
        Mockito.when(stPageModel.setAllowDuplicates(Matchers.anyBoolean())).thenReturn(stPageModel);
        Mockito.when(stPageModel.containsRegion(Matchers.eq("test"))).thenReturn(true);
        Mockito.when(stPageModel.getRegions()).thenReturn(pageModel.getRegions());

        Mockito.doNothing().when(pageBuilder).processQueryAndPromotions(Matchers.any(Localization.class), Matchers.any(SmartTargetPageModel.class), Matchers.anyString());

        //when
        SmartTargetPageModel page = ((SmartTargetPageModel) pageBuilder.createPage(dd4tPage, pageModel, localization, null));

        //then
        Assert.assertEquals(42, smartTargetRegion.getMaxItems());
        Mockito.verify(pageBuilder).processQueryAndPromotions(Matchers.eq(localization), Matchers.eq(page), Matchers.eq("SmartTarget:Entity:Promotion"));
    }

    @Test
    public void shouldNotChangePageModelWithoutRegionsMetadata() throws DxaException {
        //given
        PageModel pageModel = createPageModel(new SmartTargetRegion("test"));
        PageModel expected = createPageModel(new SmartTargetRegion("test"));

        PageImpl dd4tPage = new PageImpl();

        //when
        PageModel page = pageBuilder.createPage(null, pageModel, null, null);
        PageModel page2 = pageBuilder.createPage(dd4tPage, pageModel, null, null);

        //given
        PageTemplateImpl pageTemplate = new PageTemplateImpl();
        dd4tPage.setPageTemplate(pageTemplate);

        //when
        PageModel page3 = pageBuilder.createPage(dd4tPage, pageModel, null, null);

        //given
        pageTemplate.setMetadata(ImmutableMap.<String, Field>builder()
                .put("test", new EmbeddedField())
                .build());

        //when
        PageModel page4 = pageBuilder.createPage(dd4tPage, pageModel, null, null);

        //then
        Assert.assertEquals(expected, pageModel);
        Assert.assertEquals(expected, page);
        Assert.assertEquals(expected, page2);
        Assert.assertEquals(expected, page3);
        Assert.assertEquals(expected, page4);
    }
}
