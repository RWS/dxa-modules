package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetExperiment;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Slf4j
@Component
public class TrackingMarkupDecorator implements MarkupDecorator {

    @Setter
    private AnalyticsManager analyticsManager;

    @Override
    public HtmlNode process(HtmlNode markup, ViewModel model, WebRequestContext webRequestContext) {
        if (!(model instanceof SmartTargetExperiment)) {
            log.debug("Skip XO tracking markup, because model is not XO experiment");
            return markup;
        }

        if (this.analyticsManager == null) {
            log.info("Analytics manager for XO markup decorator is not initialized. Do you have a proper configuration?");
            return markup;
        }

        log.trace("Trying to add XO tracking markup, because model is an XO experiment");

        markup = HtmlBuilders.empty()
                .withPureHtmlContent(processMarkupByAnalytics(markup, model))
                .build();

        return markup;
    }

    String processMarkupByAnalytics(HtmlNode markup, ViewModel model) {
        SmartTargetExperiment experiment = (SmartTargetExperiment) model;
        try {
            return this.analyticsManager.addTrackingToLinks(markup.toHtml(),
                    experiment.getExperimentDimensions(), Collections.emptyMap());
        } catch (SmartTargetException e) {
            log.warn("Exception while adding tracking to experiment links", e);
            return markup.toHtml();
        }
    }

    @Override
    public int getPriority() {
        return 1;
    }
}
