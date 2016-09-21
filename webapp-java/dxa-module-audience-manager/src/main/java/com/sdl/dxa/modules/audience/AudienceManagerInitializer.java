package com.sdl.dxa.modules.audience;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
@ComponentScan("com.sdl.dxa.modules.audience")
public class AudienceManagerInitializer { //NOSONAR

    @Component
    @ModuleInfo(areaName = "AudienceManager",
            name = "Audience Manager DXA module",
            description = "Implementation of support for SDL Audience Manager")
    @RegisteredViewModels(
            @RegisteredViewModel(viewName = "LoginForm", modelClass = LoginForm.class, controllerName = "Profile")
    )
    public static class ModuleInitializer extends AbstractInitializer {

        @Override
        protected String getAreaName() {
            return "AudienceManager";
        }
    }
}
