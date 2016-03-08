package com.sdl.dxa.modules.smarttarget;

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
        String mapping = "/redirect/";
        servletContext.addServlet(servletName, TrackingRedirect.class).addMapping(mapping);
        log.info("XO tracking servlet is added with name {} and mapping {}", servletName, mapping);
    }
}
