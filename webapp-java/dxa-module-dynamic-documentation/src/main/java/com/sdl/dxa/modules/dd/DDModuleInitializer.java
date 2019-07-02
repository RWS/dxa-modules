package com.sdl.dxa.modules.dd;

import com.sdl.dxa.modules.dd.mapping.ModelBuilder;
import com.sdl.dxa.modules.dd.models.Topic;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

/**
 * DXA Initializer for Dynamic Documentation module.
 */
@Configuration
@ComponentScan(value = "com.sdl.dxa.modules.dd")
public class DDModuleInitializer {

    public static final String DYNAMIC_DOCUMENTATION = "DynamicDocumentation";

    @Component

    @RegisteredViewModels({
            @RegisteredViewModel(viewName = "GeneralPage", modelClass = DefaultPageModel.class),
            @RegisteredViewModel(viewName = "ErrorPage", modelClass = DefaultPageModel.class),
            @RegisteredViewModel(viewName = "Main", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Topic", modelClass = Topic.class)
    })
    @ModuleInfo(name = "Dynamic Documentation module", areaName = "Ish", description = "Dynamic Documentation DXA module which contains basic views")
    public static class IshViewModuleInitializer extends AbstractModuleInitializer {
        @Override
        protected String getAreaName() {
            return DYNAMIC_DOCUMENTATION;
        }
    }

    /**
     * Custom view resolver.
     * Overwrites the default ViewResolver of DXA.
     *
     * @return The view resolver.
     */
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setViewClass(JstlView.class);
        viewResolver.setPrefix("/DynamicDocumentation/Views/");
        viewResolver.setSuffix(".jsp");
        viewResolver.setOrder(Ordered.LOWEST_PRECEDENCE);
        return viewResolver;
    }

    @Bean
    public ModelBuilder modelBuilder() {
        return new ModelBuilder();
    }
}
