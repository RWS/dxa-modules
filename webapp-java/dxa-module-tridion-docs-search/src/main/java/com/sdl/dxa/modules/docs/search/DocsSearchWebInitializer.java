package com.sdl.dxa.modules.docs.search;

import com.sdl.webapp.common.util.InitializationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.WebApplicationInitializer;

import javax.servlet.ServletContext;

@Slf4j
public class DocsSearchWebInitializer implements WebApplicationInitializer {

    private String iqFieldsSeparator;
    private String iqNamespace;

    private void init() {
        iqFieldsSeparator = InitializationUtils.loadDxaProperties().getProperty("dxa.modules.docs.search.iq-field-separator");
        iqNamespace = InitializationUtils.loadDxaProperties().getProperty("dxa.modules.docs.search.iq-namespace");
    }

    @Override
    public void onStartup(ServletContext servletContext) {
        init();
        log.info("Docs search global parameters: iq-field-separator '{}' and iq-namespace '{}'. Defined in " +
                        "'dxa.modules.docs.search.properties'", iqFieldsSeparator, iqNamespace);
        servletContext.setAttribute("iq-field-separator", iqFieldsSeparator);
        servletContext.setAttribute("iq-namespace", iqNamespace);
    }
}
