package com.sdl.dxa.modules.googleanalytics;

import com.sdl.dxa.modules.googleanalytics.model.GoogleAnalyticsConfiguration;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "GoogleAnalytics", clazz = GoogleAnalyticsConfiguration.class)
})
public class GoogleAnalyticsModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "GoogleAnalytics";
    }
}
