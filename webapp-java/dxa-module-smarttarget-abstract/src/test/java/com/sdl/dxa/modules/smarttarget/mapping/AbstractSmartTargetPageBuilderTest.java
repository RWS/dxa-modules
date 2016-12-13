package com.sdl.dxa.modules.smarttarget.mapping;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.sdl.dxa.modules.smarttarget.model.entity.AbstractSmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelSetImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.tridion.mapping.PageBuilderImpl;
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.Page;
import org.dd4t.contentmodel.impl.EmbeddedField;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.contentmodel.impl.PageTemplateImpl;
import org.dd4t.contentmodel.impl.TextField;
import org.junit.Test;
import org.junit.runner.RunWith;
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
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AbstractSmartTargetPageBuilderTest {

    @Spy
    private AbstractSmartTargetPageBuilder builder = new AbstractSmartTargetPageBuilder() {

        @Override
        protected AbstractSmartTargetPageModel getSmartTargetPageModel(PageModel pageModel) {
            throw new UnsupportedOperationException();
        }

        @Override
        protected void processQueryAndPromotions(Localization localization, AbstractSmartTargetPageModel stPageModel, String promotionViewName) {
            throw new UnsupportedOperationException();
        }
    };

    private static PageModel createPageModel(RegionModel... regionModels) throws DxaException {
        PageModel pageModel = new DefaultPageModel();

        RegionModelSetImpl regionModelSet = new RegionModelSetImpl();
        Collections.addAll(regionModelSet, regionModels);
        pageModel.setRegions(regionModelSet);

        return pageModel;
    }

    @Test
    public void shouldReturnNullIfPageModelIsNull() throws ContentProviderException {
        //when, then
        assertNull(builder.createPage(null, null, null, null));
    }

    @Test
    public void shouldNotChangePageModelWithoutSTRegionsOnPage() throws ContentProviderException, DxaException {
        //given
        PageModel pageModel = createPageModel(new RegionModelImpl("test"));

        PageModel expected = createPageModel(new RegionModelImpl("test"));

        //when
        PageModel page = builder.createPage(null, pageModel, null, null);

        //then
        assertEquals(expected, pageModel);
        assertEquals(expected, page);
    }

    @Test
    public void shouldCallSubclassForSmartTargetAndProcessMetadata() throws DxaException, ContentProviderException {
        shouldCallSubclassForSmartTargetAndProcessMetadata("42");

        //TSI-2168 SmartTarget Module tests fail with NumberFormatException for input string
        shouldCallSubclassForSmartTargetAndProcessMetadata("42.0");
    }

    /**
     * The basic-flow call of the main method.
     */
    private void shouldCallSubclassForSmartTargetAndProcessMetadata(String maxItemsValue) throws DxaException, ContentProviderException {
        //given
        SmartTargetRegion smartTargetRegion = new SmartTargetRegion("test");
        PageModel pageModel = createPageModel(smartTargetRegion);
        Page dd4tPage = new PageImpl();
        Localization localization = mock(Localization.class);

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

        AbstractSmartTargetPageModel stPageModel = mock(AbstractSmartTargetPageModel.class);
        when(stPageModel.setAllowDuplicates(anyBoolean())).thenReturn(stPageModel);
        when(stPageModel.containsRegion(eq("test"))).thenReturn(true);
        when(stPageModel.getRegions()).thenReturn(pageModel.getRegions());


        doReturn(stPageModel).when(builder).getSmartTargetPageModel(eq(pageModel));
        doNothing().when(builder).processQueryAndPromotions(any(Localization.class), any(AbstractSmartTargetPageModel.class), anyString());

        //when
        AbstractSmartTargetPageModel page = ((AbstractSmartTargetPageModel) builder.createPage(dd4tPage, pageModel, localization, null));

        //then
        assertEquals(42, smartTargetRegion.getMaxItems());
        verify(builder).processQueryAndPromotions(eq(localization), eq(page), eq("SmartTarget:Entity:Promotion"));
    }

    @Test
    public void shouldNotChangePageModelWithoutRegionsMetadata() throws DxaException, ContentProviderException {
        //given
        PageModel pageModel = createPageModel(new SmartTargetRegion("test"));
        PageModel expected = createPageModel(new SmartTargetRegion("test"));

        PageImpl dd4tPage = new PageImpl();

        //when
        PageModel page = builder.createPage(null, pageModel, null, null);
        PageModel page2 = builder.createPage(dd4tPage, pageModel, null, null);

        //given
        PageTemplateImpl pageTemplate = new PageTemplateImpl();
        dd4tPage.setPageTemplate(pageTemplate);

        //when
        PageModel page3 = builder.createPage(dd4tPage, pageModel, null, null);

        //given
        pageTemplate.setMetadata(ImmutableMap.<String, Field>builder()
                .put("test", new EmbeddedField())
                .build());

        //when
        PageModel page4 = builder.createPage(dd4tPage, pageModel, null, null);

        //then
        assertEquals(expected, pageModel);
        assertEquals(expected, page);
        assertEquals(expected, page2);
        assertEquals(expected, page3);
        assertEquals(expected, page4);
    }

    @Test
    public void shouldHaveLessPriorityThanDefaultPageBuilder() {
        //given
        PageBuilderImpl pageBuilder = new PageBuilderImpl();

        //when
        int pageBuilderOrder = pageBuilder.getOrder();

        //then
        //lower is more priority
        assertTrue(pageBuilderOrder < builder.getOrder());
    }
}
