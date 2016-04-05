package com.sdl.dxa.modules.mediamanager;

import com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.stereotype.Component;

@Component
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "html5dist", modelClass = MediaManagerDistribution.class),
        @RegisteredViewModel(viewName = "imagedist", modelClass = MediaManagerDistribution.class),
        @RegisteredViewModel(viewName = "downloaddist", modelClass = MediaManagerDistribution.class),
        @RegisteredViewModel(viewName = "audiodist", modelClass = MediaManagerDistribution.class)
})
@ModuleInfo(name = "Media Manager module", areaName = "MediaManager", description = "Support for Media Manager views")
public class MediaManagerInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "MediaManager";
    }
}
