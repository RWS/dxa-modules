package com.sdl.dxa.modules.smarttarget.markup;

import com.google.common.collect.ImmutableMap;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetItem;
import com.sdl.webapp.common.api.model.entity.Article;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataImpl;
import com.sdl.webapp.common.api.model.page.PageModelImpl;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.markup.html.HtmlNode;
import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;

public class TrackingMarkupDecoratorTest {

    @Test
    public void shouldSkipProcessingIfAnalyticsManagerIfNotConfigured() {
        //given
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        decorator.setAnalyticsManager(null);
        HtmlElement markup = new HtmlElement("span", true, Collections.emptyList(), Collections.emptyList());
        Article model = new Article();
        model.setMvcData(new MvcDataImpl.MvcDataImplBuilder().metadata(ImmutableMap.of("clazz", SmartTargetItem.class)).build());

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

    @Test
    public void shouldSkipProcessingIfModelMetadataDoesNotSayItIsSmartTargetItem() {
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        HtmlElement markup = new HtmlElement("span", true, Collections.emptyList(), Collections.emptyList());
        Article model = new Article();
        model.setMvcData(new MvcDataImpl.MvcDataImplBuilder().build());

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

    @Test
    public void shouldSkipProcessingIfModelIsNotAnEntityModel() {
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        HtmlElement markup = new HtmlElement("span", true, Collections.emptyList(), Collections.emptyList());
        PageModelImpl model = new PageModelImpl();
        model.setMvcData(new MvcDataImpl.MvcDataImplBuilder().metadata(ImmutableMap.of("clazz", SmartTargetItem.class)).build());

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

}