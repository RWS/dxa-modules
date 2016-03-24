package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Configuration
@ComponentScan("com.sdl.dxa.modules.smarttarget")
@Slf4j
abstract class AbstractSmartTargetInitializer {

    @Autowired
    private MarkupDecoratorRegistry markupDecoratorRegistry;

    @PostConstruct
    public void init() {
        markupDecoratorRegistry.registerDecorator("Entity", trackingMarkupDecorator());
    }

    protected abstract MarkupDecorator trackingMarkupDecorator();

    @RegisteredViewModels({
            @RegisteredViewModel(viewName = "SmartTargetRegion", modelClass = SmartTargetRegion.class),
            @RegisteredViewModel(viewName = "2-Column", modelClass = SmartTargetRegion.class),
            @RegisteredViewModel(viewName = "3-Column", modelClass = SmartTargetRegion.class),
            @RegisteredViewModel(viewName = "4-Column", modelClass = SmartTargetRegion.class),
            @RegisteredViewModel(viewName = "Promotion", modelClass = SmartTargetPromotion.class)
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
