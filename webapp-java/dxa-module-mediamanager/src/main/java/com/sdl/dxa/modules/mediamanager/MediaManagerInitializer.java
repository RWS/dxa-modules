package com.sdl.dxa.modules.mediamanager;

import com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "html5dist", clazz = MediaManagerDistribution.class),
        @RegisteredView(viewName = "imagedist", clazz = MediaManagerDistribution.class),
        @RegisteredView(viewName = "downloaddist", clazz = MediaManagerDistribution.class),
        @RegisteredView(viewName = "audiodist", clazz = MediaManagerDistribution.class)
})
@ModuleInfo(name = "Media Manager module", areaName = "MediaManager", description = "Support for Media Manager views")
public class MediaManagerInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "MediaManager";
    }
}
