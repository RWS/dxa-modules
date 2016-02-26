package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
@ComponentScan("com.sdl.dxa.modules.smarttarget")
public class SmartTargetInitializer {

    @RegisteredViews({
            @RegisteredView(viewName = "SmartTargetRegion", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "2-Column", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "3-Column", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "4-Column", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "Promotion", clazz = SmartTargetPromotion.class)
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
