package com.sdl.dxa.modules.googleanalytics;

import com.sdl.dxa.modules.googleanalytics.model.GoogleAnalyticsConfiguration;
import com.sdl.webapp.common.impl.AbstractInitializer;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class GoogleAnalyticsModuleInitializer extends AbstractInitializer {

    private static final String AREA_NAME = "GoogleAnalytics";

    @PostConstruct
    public void initialize() throws Exception {
        this.registerViewModel("GoogleAnalytics", GoogleAnalyticsConfiguration.class);
    }

    @Override
    protected String getAreaName() {
        return AREA_NAME;
    }
}
