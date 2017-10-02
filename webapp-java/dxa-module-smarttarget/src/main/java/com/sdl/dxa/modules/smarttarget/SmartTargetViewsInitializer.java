package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.stereotype.Component;

@SuppressWarnings("unused")
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "SmartTargetRegion", modelClass = SmartTargetRegion.class),
        @RegisteredViewModel(viewName = "2-Column", modelClass = SmartTargetRegion.class),
        @RegisteredViewModel(viewName = "3-Column", modelClass = SmartTargetRegion.class),
        @RegisteredViewModel(viewName = "4-Column", modelClass = SmartTargetRegion.class),
        @RegisteredViewModel(viewName = "Promotion", modelClass = SmartTargetPromotion.class)
})
@ModuleInfo(name = "Smart Target module", areaName = "SmartTarget", description = "Common implementation for 2013SP1 and Web8 ST modules")
@Component
public class SmartTargetViewsInitializer extends AbstractModuleInitializer {
    @Override
    protected String getAreaName() {
        return "SmartTarget";
    }
}
