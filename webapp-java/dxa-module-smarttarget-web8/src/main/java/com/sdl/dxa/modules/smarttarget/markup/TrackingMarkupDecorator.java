package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetExperiment;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;

@Slf4j
public class TrackingMarkupDecorator extends AbstractTrackingMarkupDecorator {

    @Setter
    private AnalyticsManager analyticsManager;

    @Override
    protected boolean isNotExperiment(ViewModel model) {
        return !(model instanceof SmartTargetExperiment);
    }

    @Override
    protected boolean isAnalyticsManagerNotInitialized() {
        return this.analyticsManager == null;
    }

    @Override
    protected String processMarkupByAnalytics(HtmlNode markup, ViewModel model) {
        SmartTargetExperiment experiment = (SmartTargetExperiment) model;
        try {
            return this.analyticsManager.addTrackingToLinks(markup.toHtml(),
                    experiment.getExperimentDimensions(), Collections.emptyMap());
        } catch (SmartTargetException e) {
            log.warn("Exception while adding tracking to experiment links", e);
            return markup.toHtml();
        }
    }
}
