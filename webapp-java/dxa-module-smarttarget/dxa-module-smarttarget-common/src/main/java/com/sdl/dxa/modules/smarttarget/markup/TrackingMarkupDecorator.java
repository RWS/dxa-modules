package com.sdl.dxa.modules.smarttarget.markup;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetItem;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
public class TrackingMarkupDecorator implements MarkupDecorator {

    private Map<String, ExperimentDimensions> experimentDimensions = new HashMap<>();

    private AnalyticsManager analyticsManager;

    public void addExperimentDimensions(String experimentId, ExperimentDimensions experimentDimensions) {
        this.experimentDimensions.put(experimentId, experimentDimensions);
    }

    @Override
    public HtmlNode process(HtmlNode markup, ViewModel model, WebRequestContext webRequestContext) {
        if (!Objects.equals(model.getMvcData().getMetadata().get("clazz"), SmartTargetItem.class) ||
                !(model instanceof EntityModel)) {
            log.debug("Skip XO tracking markup, because model is not XO item");
            return markup;
        }

        EntityModel entityModel = (EntityModel) model;

        log.trace("Trying to add XO tracking markup, because model is an XO item");

        try {
            if (this.analyticsManager == null) {
                this.analyticsManager = AnalyticsManager.getConfiguredAnalyticsManager();
            }

            String processedMarkup = this.analyticsManager.addTrackingToLinks(markup.toHtml(),
                    experimentDimensions.get(entityModel.getId()), Collections.<String, String>emptyMap());

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
