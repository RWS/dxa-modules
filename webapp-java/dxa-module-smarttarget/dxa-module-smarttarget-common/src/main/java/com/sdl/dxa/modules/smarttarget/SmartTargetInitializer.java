package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelView;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelViews;
import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Configuration
@ComponentScan("com.sdl.dxa.modules.smarttarget")
@Slf4j
public class SmartTargetInitializer {

    @Autowired
    private MarkupDecoratorRegistry markupDecoratorRegistry;

    @PostConstruct
    public void init() {
        markupDecoratorRegistry.registerDecorator("Entity", trackingMarkupDecorator());
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

    @RegisteredModelViews({
            @RegisteredModelView(viewName = "SmartTargetRegion", modelClass = SmartTargetRegion.class),
            @RegisteredModelView(viewName = "2-Column", modelClass = SmartTargetRegion.class),
            @RegisteredModelView(viewName = "3-Column", modelClass = SmartTargetRegion.class),
            @RegisteredModelView(viewName = "4-Column", modelClass = SmartTargetRegion.class),
            @RegisteredModelView(viewName = "Promotion", modelClass = SmartTargetPromotion.class)
    })
    @ModuleInfo(name = "Smart Target module", areaName = "SmartTarget", description = "Common implementation for 2013SP1 and Web8 ST modules")
    @Component
    public static class SmartTargetViewsInitializer extends AbstractInitializer {
        @Override
        protected String getAreaName() {
            return "SmartTarget";
        }
    }

}
