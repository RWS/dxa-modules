package com.sdl.dxa.modules.smarttarget.mapping;

import com.google.common.collect.ImmutableMap;
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
import com.sdl.webapp.tridion.mapping.PageBuilderImpl;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.utils.TcmUri;
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.Page;
import org.dd4t.contentmodel.impl.EmbeddedField;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.contentmodel.impl.PageTemplateImpl;
import org.dd4t.contentmodel.impl.TextField;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collections;
import java.util.HashMap;

import static junit.framework.TestCase.assertNull;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyBoolean;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
        when(webRequestContext.getLocalization()).thenReturn(localization);
        when(localization.getId()).thenReturn("1");
    }

    @Test
    public void shouldExpectPageModelIdAsIntegerID() throws SmartTargetException {
        //given
        SmartTargetPageModel model = new SmartTargetPageModel(new DefaultPageModel());
        model.setId("128");
        BaseMatcher<TcmUri> uriMatcher = new BaseMatcher<TcmUri>() {
            @Override
            public boolean matches(Object item) {
                TcmUri uri = (TcmUri) item;
                return uri.getItemId() == 128 && uri.getPublicationId() == 1;
            }

            @Override
            public void describeTo(Description description) {
                description.appendText("TCM URI is parsed successfully");
            }
        };

        doReturn(null).when(pageBuilder).executeSmartTargetQuery(any(SmartTargetPageModel.class), any(TcmUri.class));

        //when
        pageBuilder.processQueryAndPromotions(localization, model, null);

        //then
        verify(pageBuilder).executeSmartTargetQuery(any(SmartTargetPageModel.class), argThat(uriMatcher));
    }

    @Test
    public void shouldReturnNullIfPageModelIsNull() throws ContentProviderException {
        //when, then
        assertNull(pageBuilder.createPage(null, null, null, null));
        //noinspection ConstantConditions
        assertNull(pageBuilder.buildPageModel(null, new PageModelData("", null, null, null, null), null));
    }

    @Test
    public void shouldNotChangePageModelWithoutSTRegionsOnPage() throws DxaException {
        //given
        PageModel pageModel = createPageModel(new RegionModelImpl("test"));

        PageModel expected = createPageModel(new RegionModelImpl("test"));

        //when
        PageModel page = pageBuilder.createPage(null, pageModel, null, null);
        PageModel page2 = pageBuilder.buildPageModel(pageModel, new PageModelData("", null, null, null, null), null);

        //then
        assertEquals(expected, pageModel);
        assertEquals(expected, page);
        assertEquals(expected, page2);
    }

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
        shouldCallSubclassForSmartTargetAndProcessMetadata_R2("42");

        //TSI-2168 SmartTarget Module tests fail with NumberFormatException for input string
        shouldCallSubclassForSmartTargetAndProcessMetadata("42.0");
        shouldCallSubclassForSmartTargetAndProcessMetadata_R2("42.0");
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

        Field regions = mock(Field.class);
        FieldSet fieldSet = mock(FieldSet.class);
        doReturn(Lists.newArrayList(fieldSet)).when(regions).getValues();

        doReturn(new HashMap<String, Field>() {{
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

        SmartTargetPageModel stPageModel = mock(SmartTargetPageModel.class);
        when(stPageModel.setAllowDuplicates(anyBoolean())).thenReturn(stPageModel);
        when(stPageModel.containsRegion(eq("test"))).thenReturn(true);
        when(stPageModel.getRegions()).thenReturn(pageModel.getRegions());

        doNothing().when(pageBuilder).processQueryAndPromotions(any(Localization.class), any(SmartTargetPageModel.class), anyString());

        //when
        SmartTargetPageModel page = ((SmartTargetPageModel) pageBuilder.createPage(dd4tPage, pageModel, localization, null));

        //then
        assertEquals(42, smartTargetRegion.getMaxItems());
        verify(pageBuilder).processQueryAndPromotions(eq(localization), eq(page), eq("SmartTarget:Entity:Promotion"));
    }

    private void shouldCallSubclassForSmartTargetAndProcessMetadata_R2(String maxItemsValue) throws DxaException {
        //given
        SmartTargetRegion smartTargetRegion = new SmartTargetRegion("test");
        PageModel pageModel = createPageModel(smartTargetRegion);
        RegionModelData regionModelData = RegionModelData.builder().name("test").metadata(new ContentModelData() {{
            put("maxItems", maxItemsValue);
        }}).build();
        PageModelData pageModelData = new PageModelData("id", Collections.emptyMap(), "title", Lists.newArrayList(regionModelData), "");

        SmartTargetPageModel stPageModel = mock(SmartTargetPageModel.class);
        when(stPageModel.setAllowDuplicates(anyBoolean())).thenReturn(stPageModel);
        when(stPageModel.containsRegion(eq("test"))).thenReturn(true);
        when(stPageModel.getRegions()).thenReturn(pageModel.getRegions());

        doNothing().when(pageBuilder).processQueryAndPromotions(any(Localization.class), any(SmartTargetPageModel.class), anyString());

        //when
        SmartTargetPageModel page = ((SmartTargetPageModel) pageBuilder.buildPageModel(pageModel, pageModelData, null));

        //then
        assertEquals(42, smartTargetRegion.getMaxItems());
        verify(pageBuilder).processQueryAndPromotions(eq(localization), eq(page), eq("SmartTarget:Entity:Promotion"));
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
        PageModel pageR2 = pageBuilder.buildPageModel(pageModel, new PageModelData("", null, null, null, ""), null);

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
        assertEquals(expected, pageModel);
        assertEquals(expected, page);
        assertEquals(expected, page2);
        assertEquals(expected, page3);
        assertEquals(expected, pageR2);
    }

    @Test
    public void shouldHaveLessPriorityThanDefaultPageBuilder() {
        //given
        PageBuilderImpl pageBuilder = new PageBuilderImpl();

        //when
        int pageBuilderOrder = pageBuilder.getOrder();

        //then
        //lower is more priority
        assertTrue(pageBuilderOrder < this.pageBuilder.getOrder());
    }
}
