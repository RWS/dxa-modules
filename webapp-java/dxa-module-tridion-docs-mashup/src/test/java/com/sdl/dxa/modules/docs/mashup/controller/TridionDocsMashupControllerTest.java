package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.ITridionDocsClient;
import com.sdl.dxa.modules.docs.mashup.models.widgets.StaticWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.web.pca.client.exceptions.GraphQLClientException;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.KeywordModel;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;

import javax.xml.bind.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.when;

/**
 * Test for TridionDocsMashupController class.
 */
@RunWith(MockitoJUnitRunner.class)
public class TridionDocsMashupControllerTest {
    private final String TOPIC_TITLE = "Test Topic";
    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @Mock
    private ITridionDocsClient tridionDocsClient;

    @InjectMocks
    @Spy
    TridionDocsMashupController controller;

    private ExpectedException thrown = ExpectedException.none();

    @Before
    public void init() throws IOException, GraphQLClientException {
        Topic topic = new Topic();
        topic.setTitle(TOPIC_TITLE);
        List<Topic> topics = new ArrayList<>();
        topics.add(topic);

        when(webRequestContext.getLocalization()).thenReturn(localization);
        when(localization.getCulture()).thenReturn("de");
        when(tridionDocsClient.getTopics(anyMapOf(String.class, KeywordModel.class), anyInt())).thenReturn(topics);
    }

    @Test
    public void shouldIgnoreModelIfItIsNotStaticWidget() throws Exception {
        //given
        Map<String, KeywordModel> keywords = new HashMap<>();
        KeywordModel CONTENTREFTYPE = new KeywordModel();
        CONTENTREFTYPE.setId("1");
        keywords.put("Item.FMBCONTENTREFTYPE.logical", CONTENTREFTYPE);

        StaticWidget staticWidget = new StaticWidget();
        staticWidget.setKeywords(keywords);
        staticWidget.setMaxItems(10);

        //when
        StaticWidget actual = (StaticWidget)controller.enrichModel(staticWidget, new MockHttpServletRequest());

        //then
        Assert.assertEquals(1, actual.getTopics().size());
        Assert.assertEquals(TOPIC_TITLE, actual.getTopics().get(0).getTitle());
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
        Assert.assertNull(actual.getTopics()); //Nothing should be returned when MaxItems is null
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
        Assert.assertNull(actual.getTopics()); //Nothing should be returned when MaxItems is 0
    }

    @Test (expected = ValidationException.class)
    public void shouldThrowWhenKeywordsIsNull() throws Exception {
        //given
        StaticWidget staticWidget = new StaticWidget();
        staticWidget.setKeywords(null);
        staticWidget.setMaxItems(1);

        //when
        StaticWidget actual = (StaticWidget)controller.enrichModel(staticWidget, new MockHttpServletRequest());
    }

    @Test (expected = ValidationException.class)
    public void shouldThrowWhenKeywordsIsEmpty() throws Exception {
        //given
        StaticWidget staticWidget = new StaticWidget();
        staticWidget.setKeywords(new HashMap<>());
        staticWidget.setMaxItems(1);

        //when
        StaticWidget actual = (StaticWidget)controller.enrichModel(staticWidget, new MockHttpServletRequest());
    }
}