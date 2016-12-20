package com.sdl.delivery.ish.webapp.module;

import com.sdl.delivery.ish.webapp.module.model.Topic;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

/**
 * DXA Initializer for dita module.
 */
@Component
@ComponentScan("com.sdl.delivery.ish.webapp.module")
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "Topic", modelClass = Topic.class)
})
@ModuleInfo(name = "Dita module", areaName = "Dita", description = "Dita DXA module which contains basic views")
public class DitaModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Dita";
    }
}
