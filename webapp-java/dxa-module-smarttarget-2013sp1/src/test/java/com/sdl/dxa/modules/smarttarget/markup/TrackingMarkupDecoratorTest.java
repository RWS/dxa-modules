package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetExperiment;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("Duplicates")
public class TrackingMarkupDecoratorTest {

    @Test
    public void shouldReportIfItIsNotExperiment() throws Exception {
        //given
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();

        //when
        //then
        assertTrue(decorator.isNotExperiment(new AbstractEntityModel() {
        }));
        assertFalse(decorator.isNotExperiment(new SmartTargetExperiment(null)));
    }

    @Test
    public void shouldIsAnalyticsManagerNotInitialized() throws Exception {
        //given
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();

        //when
        //then
        assertTrue(decorator.isAnalyticsManagerNotInitialized());

        //when
        decorator.setAnalyticsManager(mock(AnalyticsManager.class));
        //then
        assertFalse(decorator.isAnalyticsManagerNotInitialized());
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
        verify(analyticsManager).addTrackingToLinks(anyString(), eq(dimensions), eq(Collections.<String, String>emptyMap()));
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

        when(analyticsManager.addTrackingToLinks(anyString(), eq(dimensions), eq(Collections.<String, String>emptyMap())))
                .thenThrow(SmartTargetException.class);

        HtmlNode markup = mock(HtmlNode.class);
        String expected = "qwe";
        when(markup.toHtml()).thenReturn(expected);

        //when
        String markupByAnalytics = decorator.processMarkupByAnalytics(markup, experiment);

        //then
        assertEquals(expected, markupByAnalytics);
        verify(analyticsManager).addTrackingToLinks(anyString(), eq(dimensions), eq(Collections.<String, String>emptyMap()));
    }
}