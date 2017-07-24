package com.sdl.dxa.modules;

import com.sdl.dxa.caching.NeverCached;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.annotation.PostConstruct;
import javax.cache.CacheManager;
import javax.cache.configuration.FactoryBuilder;
import javax.cache.configuration.MutableCacheEntryListenerConfiguration;
import javax.cache.event.CacheEntryCreatedListener;
import javax.cache.event.CacheEntryEvent;
import javax.cache.event.CacheEntryEventFilter;
import javax.cache.event.CacheEntryListenerException;
import javax.cache.event.EventType;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.http.HTTPException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;

@Configuration
@Profile("!dxa.no-cache")
public class TestModuleCacheConfiguration {

    private static final Logger log = LoggerFactory.getLogger(TestModuleCacheConfiguration.class);

    @Autowired
    private CacheManager cacheManager;

    @PostConstruct
    public void configure() {
        MutableCacheEntryListenerConfiguration<Object, Object> listenerConfiguration =
                new MutableCacheEntryListenerConfiguration<>(
                        FactoryBuilder.factoryOf(new NeverCacheListener<>()),
                        FactoryBuilder.factoryOf(new OnlyCreatedFilter<>()),
                        false, true);
        cacheManager.getCacheNames()
                .forEach(cacheName -> cacheManager.getCache(cacheName).registerCacheEntryListener(listenerConfiguration));
    }

    private static class NeverCacheListener<K, V> implements CacheEntryCreatedListener<K, V>, Serializable {

        @Override
        public void onCreated(Iterable<CacheEntryEvent<? extends K, ? extends V>> cacheEntryEvents) throws CacheEntryListenerException {
            cacheEntryEvents.forEach(cacheEntryEvent -> {
                        if (cacheEntryEvent.getValue().getClass().isAnnotationPresent(NeverCached.class)) {
                            log.error("Cached a @NeverCached annotated model: '{}'", cacheEntryEvent.getValue().getClass());
                            try {
                                String webAppRoot = new ClassPathResource(".").getFile().getAbsolutePath();
                                PrintWriter writer = new PrintWriter(webAppRoot+"../../../NeverCachedException.jsp", "UTF-8");
                                writer.println("This file is generated because a @NeverCached annotated model was found in cache. Check site logs for more information.");
                                writer.close();
                            } catch (IOException e) {
                                throw new RuntimeException("Unable to create a NeverCachedException.jsp file.");
                            }
                            throw new CacheEntryListenerException("Cached a @NeverCached annotated model!");
                        } else {
                            log.debug("Cached view model is: '{}'", cacheEntryEvent.getValue().getClass());
                        }
                    }
            );
        }
    }

    private static class OnlyCreatedFilter<K, V> implements CacheEntryEventFilter<K, V>, Serializable {

        private static final long serialVersionUID = 1L;

        @Override
        public boolean evaluate(CacheEntryEvent<? extends K, ? extends V> event) throws CacheEntryListenerException {
            return event.getEventType() == EventType.CREATED;
        }
    }
}
