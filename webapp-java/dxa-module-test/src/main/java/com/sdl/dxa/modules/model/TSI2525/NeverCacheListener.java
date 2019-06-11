package com.sdl.dxa.modules.model.TSI2525;

import com.sdl.dxa.caching.NoOutputCache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import javax.cache.event.CacheEntryCreatedListener;
import javax.cache.event.CacheEntryEvent;
import javax.cache.event.CacheEntryListenerException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;

@Slf4j
public class NeverCacheListener<K, V> implements CacheEntryCreatedListener<K, V>, Serializable {

    @Override
    public void onCreated(Iterable<CacheEntryEvent<? extends K, ? extends V>> cacheEntryEvents) throws CacheEntryListenerException {
        cacheEntryEvents.forEach(cacheEntryEvent -> {
                    if (cacheEntryEvent.getValue().getClass().isAnnotationPresent(NoOutputCache.class)) {
                        log.error("Cached a @NoOutputCache annotated model: '{}'", cacheEntryEvent.getValue().getClass());
                        try {
                            String webAppRoot = new ClassPathResource(".").getFile().getAbsolutePath();
                            PrintWriter writer = new PrintWriter(webAppRoot + "../../../NoOutputCacheException.jsp", "UTF-8");
                            writer.println("This file is generated because a @NoOutputCache annotated model was found in cache. Check site logs for more information.");
                            writer.close();
                        } catch (IOException e) {
                            throw new RuntimeException("Unable to create a NoOutputCacheException.jsp file.");
                        }
                        throw new CacheEntryListenerException("Cached a @NoOutputCache annotated model!");
                    } else {
                        log.debug("Cached view model is: '{}'", cacheEntryEvent.getValue().getClass());
                    }
                }
        );
    }
}
