package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.html.HtmlAttribute;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.markup.html.HtmlNode;
import org.junit.Test;

import java.util.Collections;

import static junit.framework.TestCase.assertSame;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class TrackingMarkupDecoratorTest {

    @Test
    public void shouldSkipProcessingIfAnalyticsManagerIfNotConfigured() {
        //given
        AbstractTrackingMarkupDecorator decorator = new AbstractTrackingMarkupDecorator() {
            @Override
            protected boolean isNotExperiment(ViewModel model) {
                return false;
            }

            @Override
            protected boolean isAnalyticsManagerNotInitialized() {
                return true;
            }

            @Override
            protected String processMarkupByAnalytics(HtmlNode markup, ViewModel model) {
                throw new IllegalStateException();
            }
        };
        HtmlElement markup = new HtmlElement("span", true, Collections.<HtmlAttribute>emptyList(), Collections.<HtmlNode>emptyList());
        ViewModel model = mock(ViewModel.class);

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

    @Test
    public void shouldSkipProcessingIfItIsNotSmartTargetExperiment() {
        AbstractTrackingMarkupDecorator decorator = new AbstractTrackingMarkupDecorator() {
            @Override
            protected boolean isNotExperiment(ViewModel model) {
                return true;
            }

            @Override
            protected boolean isAnalyticsManagerNotInitialized() {
                throw new IllegalStateException();
            }

            @Override
            protected String processMarkupByAnalytics(HtmlNode markup, ViewModel model) {
                throw new IllegalStateException();
            }
        };
        HtmlElement markup = new HtmlElement("span", true, Collections.<HtmlAttribute>emptyList(), Collections.<HtmlNode>emptyList());
        SmartTargetPromotion model = new SmartTargetPromotion();

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }
}