package com.sdl.dxa.modules.docs.search;

import com.sdl.webapp.common.util.InitializationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.WebApplicationInitializer;

import javax.servlet.ServletContext;
import java.util.Properties;

@Slf4j
public class DocsSearchWebInitializer implements WebApplicationInitializer {

    private String iqFieldsSeparator;
    private String iqNamespace;

    private void init() {
        Properties properties = InitializationUtils.loadDxaProperties();
        log.trace("All read properties:\n{}", properties);
        iqFieldsSeparator = properties.getProperty("iq-field-separator");
        iqNamespace = properties.getProperty("iq-namespace");
    }

    @Override
    public void onStartup(ServletContext servletContext) {
        init();
        log.info("Docs search global parameters: \niq-field-separator '{}' and \niq-namespace '{}'.\nDefined in " +
                "'dxa.modules.docs.search.properties'", iqFieldsSeparator, iqNamespace);
        servletContext.setInitParameter("iq-field-separator", iqFieldsSeparator);
        servletContext.setInitParameter("iq-namespace", iqNamespace);
    }
}
