package com.sdl.dxa.modules.smarttarget;

import com.sdl.webapp.common.util.InitializationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.WebApplicationInitializer;

import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@Slf4j
public abstract class AbstractSmartTargetWebInitializer implements WebApplicationInitializer {
    private String getRedirectUrl() {
        String mapping;

        log.debug("Trying to get redirect link for XO tracking from XO configuration");
        mapping = getTrackingRedirectUrl();

        if (mapping == null) {
            log.debug("Failed to get redirect link for XO tracking from XO configuration, fallback to DXA properties file");
            mapping = InitializationUtils.loadDxaProperties().getProperty("dxa.modules.xo.fallbackRedirectUrl");

            if (mapping == null) {
                log.debug("Failed to get redirect link for XO tracking from properties file, fallback to default value");
                mapping = "/redirect/";
            }
        }
        return mapping;
    }

    protected abstract String getTrackingRedirectUrl();

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        String servletName = "dxaXoTracking";
        String mapping = getRedirectUrl();

        servletContext.addServlet(servletName, getTrackingRedirectClass()).addMapping(mapping);
        log.info("XO tracking servlet is added with name {} and mapping {}", servletName, mapping);
    }

    protected abstract Class<? extends Servlet> getTrackingRedirectClass();
}
