package com.sdl.delivery.ish.webapp.module;

import com.sdl.delivery.ish.webapp.module.model.HelloModel;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

/**
 * DXA Initializer for HelloModel.
 */
@Component
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "HelloView", modelClass = HelloModel.class)
})
@ComponentScan("com.sdl.delivery.ish.webapp.module")
public class DitaModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Hello";
    }
}
