package com.sdl.dxa.modules.mediamanager;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import org.springframework.stereotype.Component;

@Component
public class MediaManagerInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "MediaManager";
    }
}
