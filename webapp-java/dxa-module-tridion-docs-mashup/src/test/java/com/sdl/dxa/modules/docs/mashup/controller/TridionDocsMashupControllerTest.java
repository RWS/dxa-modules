package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.TridionDocsClient;
import com.sdl.dxa.modules.docs.mashup.exception.DocsMashupException;
import com.sdl.dxa.modules.docs.mashup.models.products.Product;
import com.sdl.dxa.modules.docs.mashup.models.widgets.DynamicWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.StaticWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.Dxa22ContentProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.RegionModelSet;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelSetImpl;
import jakarta.xml.bind.ValidationException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

/**
 * Test for TridionDocsMashupController class.
 */
@ExtendWith(MockitoExtension.class)
public class TridionDocsMashupControllerTest {
    private final RichText TOPIC_TITLE = new RichText("Test Topic");
    private final String PRODUCT_VIEW_MODEL = "Test View";
	
    @Mock
    private WebRequestContext webRequestContext;
    
    @Mock
    private Dxa22ContentProvider contentProvider;

    @Mock
    private Localization localization;

    @Mock
    private TridionDocsClient tridionDocsClient;

    TridionDocsMashupController controller;

    @BeforeEach
    public void init() throws DocsMashupException {
        controller = new TridionDocsMashupController(webRequestContext, contentProvider, tridionDocsClient);

        Topic topic = new Topic();
        topic.setTitle(TOPIC_TITLE);
        List<Topic> topics = new ArrayList<>();
        topics.add(topic);

        lenient().when(webRequestContext.getLocalization()).thenReturn(localization);
        lenient().when(localization.getCulture()).thenReturn("de");
        lenient().when(tridionDocsClient.getTopicsByKeywords(anyMap(), anyInt())).thenReturn(topics);
    }

    private Map<String, KeywordModel> getTestKeywords() {
        Map<String, KeywordModel> keywords = new HashMap<>();

        KeywordModel CONTENTREFTYPE = new KeywordModel();
        CONTENTREFTYPE.setId("1");
        keywords.put("Item.FMBCONTENTREFTYPE.logical", CONTENTREFTYPE);

        return keywords;
    }

    @Test
    public void shouldIgnoreModelIfItIsNotStaticWidget() throws Exception {
        //given
		StaticWidget staticWidget = new StaticWidget();
        staticWidget.setKeywords(getTestKeywords());
        staticWidget.setMaxItems(10);

        //when
        StaticWidget actual = (StaticWidget)controller.enrichModel(staticWidget, new MockHttpServletRequest());

        //then
        assertEquals(1, actual.getTopics().size());
        assertEquals(TOPIC_TITLE, actual.getTopics().get(0).getTitle());
    }

    @Test
    public void shouldIgnoreModelIfItIsNotDynamicWidget() throws Exception {
        //given
        RegionModel regionmodel = mock(RegionModelImpl.class);
        RegionModelSet regionModelSet = new RegionModelSetImpl();
        regionModelSet.add(regionmodel);
        PageModel page = mock(PageModel.class);

        MvcData mvcData = mock(MvcData.class);
        List<EntityModel> entities = new ArrayList<>();
        Product product = new Product();
        product.setTitle("Product 1");
        product.setKeywords(getTestKeywords());
        product.setMvcData(mvcData);
        entities.add(product);

        when(mvcData.getViewName()).thenReturn(PRODUCT_VIEW_MODEL);
        when(regionmodel.getEntities()).thenReturn(entities);
        when(page.getRegions()).thenReturn(regionModelSet);
        when(webRequestContext.getPage()).thenReturn(page);

        List<String> keywords = new ArrayList<>();

        keywords.add("FMBCONTENTREFTYPE");

        DynamicWidget dynamicWidget = new DynamicWidget();
        dynamicWidget.setProductViewModel(PRODUCT_VIEW_MODEL);
        dynamicWidget.setKeywords(keywords);
        dynamicWidget.setMaxItems(10);

        //when
        DynamicWidget actual = (DynamicWidget)controller.enrichModel(dynamicWidget, new MockHttpServletRequest());

        //then
        assertEquals(1, actual.getTopics().size());
        assertEquals(TOPIC_TITLE, actual.getTopics().get(0).getTitle());
    }

    @Test
    public void shouldReturnEmptyTopicsWhenMaxItemsIsNull() throws Exception {
        //given
        StaticWidget staticWidget = new StaticWidget();
        staticWidget.setKeywords(new HashMap<>());
        staticWidget.setMaxItems(null);

        //when
        StaticWidget actual = (StaticWidget)controller.enrichModel(staticWidget, new MockHttpServletRequest());

        //then
        assertNull(actual.getTopics()); //Nothing should be returned when MaxItems is null
    }

    @Test
    public void shouldReturnEmptyTopicsWhenMaxItemsIsZero() throws Exception {
        //given
        StaticWidget staticWidget = new StaticWidget();
        staticWidget.setKeywords(new HashMap<>());
        staticWidget.setMaxItems(0);

        //when
        StaticWidget actual = (StaticWidget)controller.enrichModel(staticWidget, new MockHttpServletRequest());

        //then
        assertNull(actual.getTopics()); //Nothing should be returned when MaxItems is 0
    }

    @Test
    public void shouldThrowWhenKeywordsNotInRightFormat() throws Exception {
        Assertions.assertThrows(ValidationException.class, () -> {
            //given
            Map<String, KeywordModel> keywords = new HashMap<>();

            KeywordModel CONTENTREFTYPE = new KeywordModel();
            CONTENTREFTYPE.setId("1");
            keywords.put("FMBCONTENTREFTYPE", CONTENTREFTYPE);

            StaticWidget staticWidget = new StaticWidget();
            staticWidget.setKeywords(keywords);
            staticWidget.setMaxItems(1);

            //when
            StaticWidget actual = (StaticWidget) controller.enrichModel(staticWidget, new MockHttpServletRequest());
        });
    }
}