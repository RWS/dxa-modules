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

    public DocsSearchWebInitializer() {
    }

    private void init() {
        Properties properties = InitializationUtils.loadDxaProperties();
        log.trace("All read properties:\n{}", properties);
        this.iqFieldsSeparator = this.makeStringNotNull(properties.getProperty("iq-field-separator"));
        this.iqNamespace = this.makeStringNotNull(properties.getProperty("iq-namespace"));
        this.iqDefaultLanguage = this.makeStringNotNull(properties.getProperty("iq-default-language"));
    }

    private String makeStringNotNull(String source) {
        return source == null ? "" : source;
    }

    public void onStartup(ServletContext servletContext) {
        this.init();
        log.info("Docs search global parameters defined in 'dxa.properties':\niq-field-separator '{}',\niq-namespace '{}',\niq-default-language '{}'.", new Object[]{this.iqFieldsSeparator, this.iqNamespace, this.iqDefaultLanguage});
        servletContext.setInitParameter("iq-field-separator", this.iqFieldsSeparator);
        servletContext.setInitParameter("iq-namespace", this.iqNamespace);
        servletContext.setInitParameter("iq-default-language", this.iqDefaultLanguage);
    }
}
