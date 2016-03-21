package com.sdl.dxa.modules.mediamanager;

import com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelView;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelViews;
import org.springframework.stereotype.Component;

@Component
@RegisteredModelViews({
        @RegisteredModelView(viewName = "html5dist", modelClass = MediaManagerDistribution.class),
        @RegisteredModelView(viewName = "imagedist", modelClass = MediaManagerDistribution.class),
        @RegisteredModelView(viewName = "downloaddist", modelClass = MediaManagerDistribution.class),
        @RegisteredModelView(viewName = "audiodist", modelClass = MediaManagerDistribution.class)
})
@ModuleInfo(name = "Media Manager module", areaName = "MediaManager", description = "Support for Media Manager views")
public class MediaManagerInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "MediaManager";
    }
}
