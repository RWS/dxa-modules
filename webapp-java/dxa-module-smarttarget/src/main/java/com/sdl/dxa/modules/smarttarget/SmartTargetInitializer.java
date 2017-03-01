package com.sdl.dxa.modules.smarttarget;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.dxa.modules.smarttarget.model.json.ExperimentDimensionsMixin;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Slf4j
@Configuration
public class SmartTargetInitializer {

    @Autowired
    private ObjectMapper objectMapper;

    @PostConstruct
    public void experimentMixin() {
        objectMapper.addMixIn(ExperimentDimensions.class, ExperimentDimensionsMixin.class);
    }

    @Bean
    public TrackingMarkupDecorator trackingMarkupDecorator() {
        TrackingMarkupDecorator trackingMarkupDecorator = new TrackingMarkupDecorator();
        try {
            trackingMarkupDecorator.setAnalyticsManager(AnalyticsManager.getConfiguredAnalyticsManager());
        } catch (SmartTargetException e) {
            log.warn("Analytics manager for XO markup decorator can't be initialized. Do you have a proper configuration?", e);
        }
        return trackingMarkupDecorator;
    }
}
