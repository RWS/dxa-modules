package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import lombok.extern.slf4j.Slf4j;

@Slf4j
abstract class AbstractTrackingMarkupDecorator implements MarkupDecorator {

    @Override
    public HtmlNode process(HtmlNode markup, ViewModel model, WebRequestContext webRequestContext) {
        if (isNotExperiment(model)) {
            log.debug("Skip XO tracking markup, because model is not XO experiment");
            return markup;
        }

        if (isAnalyticsManagerNotInitialized()) {
            log.info("Analytics manager for XO markup decorator is not initialized. Do you have a proper configuration?");
            return markup;
        }

        log.trace("Trying to add XO tracking markup, because model is an XO experiment");

        markup = HtmlBuilders.empty()
                .withPureHtmlContent(processMarkupByAnalytics(markup, model))
                .build();

        return markup;
    }

    protected abstract boolean isNotExperiment(ViewModel model);

    protected abstract boolean isAnalyticsManagerNotInitialized();

    protected abstract String processMarkupByAnalytics(HtmlNode markup, ViewModel model);

    @Override
    public int getPriority() {
        return 1;
    }
}
