package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.markup.AbstractTrackingMarkupDecorator;
import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class SmartTargetInitializer {
    @Bean
    public AbstractTrackingMarkupDecorator trackingMarkupDecorator() {
        TrackingMarkupDecorator trackingMarkupDecorator = new TrackingMarkupDecorator();
        try {
            trackingMarkupDecorator.setAnalyticsManager(AnalyticsManager.getConfiguredAnalyticsManager());
        } catch (SmartTargetException e) {
            log.warn("Analytics manager for XO markup decorator can't be initialized. Do you have a proper configuration?", e);
        }
        return trackingMarkupDecorator;
    }
}
