package com.sdl.ditadelivery.webapp;

import com.sdl.ditadelivery.webapp.controllers.PageController;
import com.sdl.dxa.DxaSpringInitialization;
import org.springframework.context.annotation.*;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

/**
 * Initializes Spring context for web application.
 */
@Configuration
@ComponentScan(
        basePackages = "com.sdl.ditadelivery",
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
