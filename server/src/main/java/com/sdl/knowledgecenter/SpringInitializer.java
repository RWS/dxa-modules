package com.sdl.knowledgecenter;

import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.knowledgecenter.controllers.PageController;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;

/**
 * Initializes Spring context for web application.
 */
@Configuration
@ComponentScan(
        basePackages = "com.sdl.knowledgecenter",
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                value = PageController.class
        )
)
@Import(DxaSpringInitialization.class)
public class SpringInitializer {

}
