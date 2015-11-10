package com.sdl.dxa.modules.mediamanager;

import com.sdl.webapp.common.impl.AbstractInitializer;
import org.springframework.stereotype.Component;

@Component
public class MediaManagerInitializer extends AbstractInitializer {
    @Override
    protected String getAreaName() {
        return "MediaManager";
    }
}
