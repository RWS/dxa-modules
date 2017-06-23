package com.sdl.dxa.modules.nocache.listener;

import com.sdl.dxa.caching.NeverCached;
import org.ehcache.impl.events.CacheEventAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NeverCachedListener extends CacheEventAdapter<Object, Object> {
    private static final Logger log = LoggerFactory.getLogger(NeverCachedListener.class);

    @Override
    protected void onCreation(Object key, Object newValue) {
        if (newValue.getClass().isAnnotationPresent(NeverCached.class)) {
            log.error("Cached a @NeverCached annotated model: '{}'", newValue.getClass());
        }
    }
}
