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
    private static String getRedirectUrl() {
        String mapping;
        try {
            log.debug("Trying to get redirect link for XO tracking from XO configuration");
            mapping = AnalyticsManager.getConfiguredAnalyticsManager().getConfiguration().getTrackingRedirectUrl();
            log.debug("Redirect link for XO tracking is set from XO configuration: {}", mapping);
        } catch (SmartTargetException e) {
            log.debug("Failed to get redirect link for XO tracking from XO configuration, fallback to DXA properties file", e);
            mapping = InitializationUtils.loadDxaProperties("dxa.modules.xo.properties").getProperty("dxa.modules.xo.fallbackRedirectUrl");

            if (mapping == null) {
                log.debug("Failed to get redirect link for XO tracking from properties file, fallback to default value", e);
                mapping = "/redirect/";
            }
        }
        return mapping;
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        String servletName = "dxaXoTracking";
        String mapping = getRedirectUrl();

        servletContext.addServlet(servletName, TrackingRedirect.class).addMapping(mapping);
        log.info("XO tracking servlet is added with name {} and mapping {}", servletName, mapping);
    }
}
