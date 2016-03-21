package com.sdl.dxa.modules.googleanalytics;

import com.sdl.dxa.modules.googleanalytics.model.GoogleAnalyticsConfiguration;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import org.springframework.stereotype.Component;

@Component
@RegisteredViewModel(viewName = "GoogleAnalytics", modelClass = GoogleAnalyticsConfiguration.class)
@ModuleInfo(name = "Google Analytics module", areaName = "GoogleAnalytics",
        description = "Support for Google Analytics view")
public class GoogleAnalyticsModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "GoogleAnalytics";
    }
}
