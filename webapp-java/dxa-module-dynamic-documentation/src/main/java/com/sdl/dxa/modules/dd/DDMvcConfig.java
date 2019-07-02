package com.sdl.dxa.modules.dd;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

/**
 * The MVC Spring configuration.
 */
@Configuration
@EnableWebMvc
public class DDMvcConfig extends WebMvcConfigurerAdapter {
    /* Time, in seconds, to have the browser cache static resources (one week). */
    private static final int BROWSER_CACHE_CONTROL = 604800;

    /**
     * Add resource handlers for the gui.
     *
     * @param registry Resource registry.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registry
                .addResourceHandler("/gui/**")
                .addResourceLocations("classpath:/gui/", "/gui/")
                .setCachePeriod(BROWSER_CACHE_CONTROL);
        registry
                .addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/gui/favicon.ico")
                .setCachePeriod(BROWSER_CACHE_CONTROL);
        registry
                .addResourceHandler("/system/assets/gui/assets/favicon.ico")
                .addResourceLocations("classpath:/gui/favicon.ico")
                .setCachePeriod(BROWSER_CACHE_CONTROL);
        registry
                .addResourceHandler("/robots.txt")
                .addResourceLocations("/robots.txt");
    }

    @Override
    public void extendMessageConverters (List<HttpMessageConverter<?>> converters) {
        StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
        stringConverter.setSupportedMediaTypes(Arrays.asList(
                MediaType.TEXT_PLAIN,
                MediaType.TEXT_HTML,
                MediaType.APPLICATION_JSON));
        converters.add(0, stringConverter);
    }
}
