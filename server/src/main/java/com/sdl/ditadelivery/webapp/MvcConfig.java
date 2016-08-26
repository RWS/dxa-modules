package com.sdl.ditadelivery.webapp;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
public class MvcConfig extends WebMvcConfigurerAdapter {
    /* Time, in seconds, to have the browser cache static resources (one week). */
    private static final int BROWSER_CACHE_CONTROL = 604800;

    /**
     * Add resource handlers for the gui
     *
     * @param registry Resource registry.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("/gui/**")
                .addResourceLocations("/WEB-INF/classes/gui/")
                .setCachePeriod(BROWSER_CACHE_CONTROL);
    }
}