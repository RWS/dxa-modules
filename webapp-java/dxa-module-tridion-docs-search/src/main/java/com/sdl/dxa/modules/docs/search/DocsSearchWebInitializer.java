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
    private String iqDefaultLanguage;

    private void init() {
        Properties properties = InitializationUtils.loadDxaProperties();
        log.trace("All read properties:\n{}", properties);
        iqFieldsSeparator = properties.getProperty("iq-field-separator");
        iqNamespace = properties.getProperty("iq-namespace");
        iqDefaultLanguage = properties.getProperty("iq-default-language");
    }

    @Override
    public void onStartup(ServletContext servletContext) {
        init();
        log.info("Docs search global parameters: " +
                        "\niq-field-separator '{}', " +
                        "\niq-namespace '{}', " +
                        "\niq-default-language '{}'." +
                        "\nDefined in 'dxa.properties'",
                iqFieldsSeparator, iqNamespace, iqDefaultLanguage);
        servletContext.setInitParameter("iq-field-separator", iqFieldsSeparator);
        servletContext.setInitParameter("iq-namespace", iqNamespace);
        servletContext.setInitParameter("iq-default-language", iqDefaultLanguage);
    }
}
