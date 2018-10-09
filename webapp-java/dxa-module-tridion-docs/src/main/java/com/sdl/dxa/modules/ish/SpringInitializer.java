package com.sdl.dxa.modules.ish;

import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.dxa.modules.docs.MvcConfig;
import com.sdl.webapp.common.controller.PageController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

/**
 * Initializes Spring context for web application.
 */
@Configuration
@ComponentScan(
        basePackages = "com.sdl.dxa.modules.ish",
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                value = PageController.class
        )
)
@Import({DxaSpringInitialization.class, MvcConfig.class})
public class SpringInitializer {

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
        viewResolver.setPrefix("/WEB-INF/classes/WEB-INF/Views/");
        viewResolver.setSuffix(".jsp");
        viewResolver.setOrder(Ordered.LOWEST_PRECEDENCE);
        return viewResolver;
    }
}
