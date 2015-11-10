package com.sdl.dxa.modules.googleanalytics;

import com.sdl.dxa.modules.googleanalytics.model.GoogleAnalyticsConfiguration;
import com.sdl.webapp.common.impl.AbstractInitializer;
import org.springframework.stereotype.Component;

@Component
public class GoogleAnalyticsModuleInitializer extends AbstractInitializer {

    private static final String AREA_NAME = "GoogleAnalytics";

    @Override
    protected boolean registerModule() {
        this.registerViewModel("GoogleAnalytics", GoogleAnalyticsConfiguration.class);
        return true;
    }

    @Override
    protected String getAreaName() {
        return AREA_NAME;
    }
}
