package com.sdl.dxa.modules.audience;

import com.sdl.dxa.modules.audience.model.CurrentUserWidget;
import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.util.InitializationUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.stereotype.Component;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.filter.DelegatingFilterProxy;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@Configuration
@ComponentScan("com.sdl.dxa.modules.audience")
@ImportResource("classpath:spring-security.xml")
public class AudienceManagerInitializer { //NOSONAR

    @Value("${dxa.spring.security.remember.key:#{'dxa-remember-key'}}")
    private String dxaSpringSecurityRememberKey;

    @Value("${dxa.spring.security.realm.name:#{'DXA'}}")
    private String dxaSpringSecurityRealmName;

    @Bean
    public String rememberMeKey() {
        return dxaSpringSecurityRememberKey;
    }

    @Bean
    public String realmName() {
        return dxaSpringSecurityRealmName;
    }

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

    public static class SecurityWebInitialization implements WebApplicationInitializer {

        @Override
        public void onStartup(ServletContext servletContext) throws ServletException {
            InitializationUtils.registerListener(servletContext, RequestContextListener.class);
            InitializationUtils.registerFilter(servletContext, "springSecurityFilterChain", DelegatingFilterProxy.class, "/*");
        }
    }
}
