package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetExperiment;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import org.junit.Test;

import java.util.Collections;

import static junit.framework.TestCase.assertSame;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class TrackingMarkupDecoratorTest {

    @Test
    public void shouldSkipProcessingIfAnalyticsManagerIfNotConfigured() {
        //given
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        HtmlElement markup = new HtmlElement("span", true, Collections.emptyList(), Collections.emptyList());
        ViewModel model = mock(ViewModel.class);

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

    @Test
    public void shouldSkipProcessingIfItIsNotSmartTargetExperiment() {
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        HtmlElement markup = new HtmlElement("span", true, Collections.emptyList(), Collections.emptyList());
        SmartTargetPromotion model = new SmartTargetPromotion();

        //when
        HtmlNode result = decorator.process(markup, model, null);

        //then
        assertEquals(markup, result);
        assertSame(markup, result);
    }

    @Test
    public void shouldProcessMarkupByAnalytics() throws Exception {
        //given
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        AnalyticsManager analyticsManager = mock(AnalyticsManager.class);
        decorator.setAnalyticsManager(analyticsManager);
        ExperimentDimensions dimensions = mock(ExperimentDimensions.class);
        SmartTargetExperiment experiment = new SmartTargetExperiment(dimensions);

        //when
        decorator.processMarkupByAnalytics(mock(HtmlNode.class), experiment);

        //then
        verify(analyticsManager).addTrackingToLinks(anyString(), eq(dimensions), eq(Collections.emptyMap()));
    }

    @SuppressWarnings("unchecked")
    @Test
    public void shouldReturnMarkupIfAnalyticsThrownException() throws Exception {
        //given
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        AnalyticsManager analyticsManager = mock(AnalyticsManager.class);
        decorator.setAnalyticsManager(analyticsManager);
        ExperimentDimensions dimensions = mock(ExperimentDimensions.class);
        SmartTargetExperiment experiment = new SmartTargetExperiment(dimensions);

        when(analyticsManager.addTrackingToLinks(anyString(), eq(dimensions), eq(Collections.emptyMap())))
                .thenThrow(SmartTargetException.class);

        HtmlNode markup = mock(HtmlNode.class);
        String expected = "qwe";
        when(markup.toHtml()).thenReturn(expected);

        //when
        String markupByAnalytics = decorator.processMarkupByAnalytics(markup, experiment);

        //then
        assertEquals(expected, markupByAnalytics);
        verify(analyticsManager).addTrackingToLinks(anyString(), eq(dimensions), eq(Collections.emptyMap()));
    }
}