package com.sdl.dxa.modules.smarttarget;

import com.sdl.webapp.common.util.InitializationUtils;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.TrackingRedirect;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.WebApplicationInitializer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@Slf4j
public class SmartTargetWebInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        String servletName = "dxaXoTracking";
        String mapping = getRedirectUrl();

        servletContext.addServlet(servletName, TrackingRedirect.class).addMapping(mapping);
        log.info("XO tracking servlet is added with name {} and mapping {}", servletName, mapping);
    }

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

    private String getTrackingRedirectUrl() {
        try {
            return AnalyticsManager.getConfiguredAnalyticsManager().getConfiguration().getTrackingRedirectUrl();
        } catch (SmartTargetException e) {
            log.warn("Failed to get analytics manager configuration", e);
            return null;
        }
    }

}
