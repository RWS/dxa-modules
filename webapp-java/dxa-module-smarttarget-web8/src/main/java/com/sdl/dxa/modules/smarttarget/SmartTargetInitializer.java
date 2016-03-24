package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;

@Slf4j
public class SmartTargetInitializer extends AbstractSmartTargetInitializer {

    @Bean
    public MarkupDecorator trackingMarkupDecorator() {
        TrackingMarkupDecorator trackingMarkupDecorator = new TrackingMarkupDecorator();
        try {
            trackingMarkupDecorator.setAnalyticsManager(AnalyticsManager.getConfiguredAnalyticsManager());
        } catch (SmartTargetException e) {
            log.warn("Analytics manager for XO markup decorator can't be initialized. Do you have a proper configuration?", e);
        }
        return trackingMarkupDecorator;
    }
}
