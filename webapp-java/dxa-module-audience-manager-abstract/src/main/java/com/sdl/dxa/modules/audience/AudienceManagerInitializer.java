package com.sdl.dxa.modules.audience;

import com.sdl.dxa.modules.audience.model.CurrentUserWidget;
import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.util.InitializationUtils;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@Configuration
@ComponentScan("com.sdl.dxa.modules.audience")
public class AudienceManagerInitializer { //NOSONAR

    @Component
    @ModuleInfo(areaName = "AudienceManager",
            name = "Audience Manager DXA module",
            description = "Implementation of support for SDL Audience Manager")
    @RegisteredViewModels(value = {
            @RegisteredViewModel(viewName = "LoginForm", modelClass = LoginForm.class, controllerName = "Profile"),
            @RegisteredViewModel(viewName = "CurrentUserWidget", modelClass = CurrentUserWidget.class)
    })
    public static class ModuleInitializer extends AbstractInitializer {

        @Override
        protected String getAreaName() {
            return "AudienceManager";
        }
    }

    public static class SecurityWebInitialization extends WebMvcConfigurerAdapter implements WebApplicationInitializer {

        @Override
        public void onStartup(ServletContext servletContext) throws ServletException {
            InitializationUtils.registerFilter(servletContext, SecurityContextPersistenceFilter.class, "/*");
        }
    }
}
