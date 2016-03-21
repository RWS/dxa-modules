package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetExperiment;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.webapp.common.markup.html.HtmlAttribute;
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
        HtmlElement markup = new HtmlElement("span", true, Collections.<HtmlAttribute>emptyList(), Collections.<HtmlNode>emptyList());
        SmartTargetExperiment model = new SmartTargetExperiment(null);

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

    @Test
    public void shouldSkipProcessingIfItIsNotSmartTargetExperiment() {
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        HtmlElement markup = new HtmlElement("span", true, Collections.<HtmlAttribute>emptyList(), Collections.<HtmlNode>emptyList());
        SmartTargetPromotion model = new SmartTargetPromotion();

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }
}