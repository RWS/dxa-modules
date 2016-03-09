package com.sdl.dxa.modules.smarttarget;

import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.TrackingRedirect;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.web.WebApplicationInitializer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import java.io.IOException;

@Slf4j
public class SmartTargetWebInitializer implements WebApplicationInitializer {
    private static String getRedirectUrl() {
        String mapping;
        try {
            log.debug("Trying to get redirect link for XO tracking from XO configuration");
            mapping = AnalyticsManager.getConfiguredAnalyticsManager().getConfiguration().getTrackingRedirectUrl();
            log.debug("Redirect link for XO tracking is set from XO configuration: {}", mapping);
        } catch (SmartTargetException e) {
            try {
                log.debug("Failed to get redirect link for XO tracking from XO configuration, fallback to properties file", e);
                mapping = PropertiesLoaderUtils.loadProperties(new ClassPathResource("dxa.modules.xo.properties"))
                        .getProperty("dxa.modules.xo.fallbackRedirectUrl");
            } catch (IOException e1) {
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
