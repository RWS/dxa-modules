package com.sdl.dxa.modules.cid;

import com.sdl.webapp.common.util.InitializationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.WebApplicationInitializer;

import jakarta.servlet.Filter;
import jakarta.servlet.Servlet;
import jakarta.servlet.ServletContext;
import java.util.Properties;

@Slf4j
public class CidWebInitializer implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext servletContext) {
        log.debug("Trying to initialize servlet for CID module");

        Properties properties = InitializationUtils.loadDxaProperties();

        String className = properties.getProperty("dxa.modules.cid.className");
        Class<?> clazz = InitializationUtils.classForNameIfPresent(className);
        if (clazz == null) {
            log.warn("Failed to initialize CID module because {} is not in classpath", className);
            return;
        }

        String mapping = properties.getProperty("dxa.modules.cid.mapping");
        if (Filter.class.isAssignableFrom(clazz)) {
            InitializationUtils.registerFilter(servletContext, className, mapping);
        } else if (Servlet.class.isAssignableFrom(clazz)) {
            InitializationUtils.registerServlet(servletContext, className, mapping);
        } else {
            log.warn("Class {} for CID module is expected to be either Filter of Servlet but is", className);
        }

        // session id rename has moved to DXA Web Initialization
    }
}
