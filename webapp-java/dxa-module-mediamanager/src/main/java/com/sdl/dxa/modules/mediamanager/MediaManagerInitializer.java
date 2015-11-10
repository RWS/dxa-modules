package com.sdl.dxa.modules.mediamanager;

import com.sdl.webapp.common.impl.AbstractInitializer;
import org.springframework.stereotype.Component;

@Component
public class MediaManagerInitializer extends AbstractInitializer {
    @Override
    protected boolean registerModule() {
        return true;
    }

    @Override
    protected String getAreaName() {
        return "MediaManager";
    }
}
