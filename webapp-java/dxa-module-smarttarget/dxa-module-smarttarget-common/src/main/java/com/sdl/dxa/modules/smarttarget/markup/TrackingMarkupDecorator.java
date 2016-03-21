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

import java.util.Collections;

@Slf4j
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

        SmartTargetExperiment experiment = (SmartTargetExperiment) model;

        log.trace("Trying to add XO tracking markup, because model is an XO experiment");

        try {
//          todo dxa2 remove suppress if Java 7 is no longer supported
            @SuppressWarnings("RedundantTypeArguments")
            String processedMarkup = this.analyticsManager.addTrackingToLinks(markup.toHtml(),
                    experiment.getExperimentDimensions(), Collections.<String, String>emptyMap());

            markup = HtmlBuilders.empty()
                    .withPureHtmlContent(processedMarkup)
                    .build();
        } catch (SmartTargetException e) {
            log.error("Exception adding Xo tracking to existing markup", e);
        }
        return markup;
    }

    @Override
    public int getPriority() {
        return 1;
    }
}
