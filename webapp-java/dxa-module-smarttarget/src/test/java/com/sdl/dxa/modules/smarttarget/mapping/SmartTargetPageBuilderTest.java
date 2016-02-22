package com.sdl.dxa.modules.smarttarget.mapping;

import com.google.common.collect.ImmutableMap;
import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetRegion;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.page.PageModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelSetImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.tridion.mapping.PageBuilderImpl;
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.impl.EmbeddedField;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.contentmodel.impl.PageTemplateImpl;
import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class SmartTargetPageBuilderTest {

    private SmartTargetPageBuilder builder = new SmartTargetPageBuilder();

    private static PageModel createPageModel(RegionModel... regionModels) throws DxaException {
        PageModel pageModel = new PageModelImpl();

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