package com.sdl.dxa.modules.smarttarget;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.dxa.modules.smarttarget.model.json.ExperimentDimensionsMixin;
import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Slf4j
@Configuration
@ComponentScan("com.sdl.dxa.modules.smarttarget")
public class SmartTargetInitializer {

    private final ObjectMapper objectMapper;

    private final MarkupDecoratorRegistry markupDecoratorRegistry;

    private final TrackingMarkupDecorator trackingMarkupDecorator;


    @Autowired
    public SmartTargetInitializer(ObjectMapper objectMapper, MarkupDecoratorRegistry markupDecoratorRegistry, TrackingMarkupDecorator trackingMarkupDecorator) {
        this.objectMapper = objectMapper;
        this.markupDecoratorRegistry = markupDecoratorRegistry;
        this.trackingMarkupDecorator = trackingMarkupDecorator;
    }

    @PostConstruct
    public void init() {
        objectMapper.addMixIn(ExperimentDimensions.class, ExperimentDimensionsMixin.class);

        markupDecoratorRegistry.registerDecorator("Entity", trackingMarkupDecorator);
        markupDecoratorRegistry.registerDecorator("Entities", trackingMarkupDecorator);
    }

    @Bean
    public TrackingMarkupDecorator trackingMarkupDecorator() {
        TrackingMarkupDecorator decorator = new TrackingMarkupDecorator();
        try {
            decorator.setAnalyticsManager(AnalyticsManager.getConfiguredAnalyticsManager());
        } catch (SmartTargetException e) {
            log.warn("Analytics manager for XO markup decorator can't be initialized. Do you have a proper configuration?", e);
        }
        return decorator;
    }
}
