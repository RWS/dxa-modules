package com.sdl.dxa.modules.model.TSI2525;

import com.sdl.dxa.caching.NamedCacheProvider;
import com.sdl.dxa.caching.wrapper.SimpleCacheWrapper;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;

import javax.cache.configuration.FactoryBuilder;
import javax.cache.configuration.MutableCacheEntryListenerConfiguration;

import static org.springframework.util.ClassUtils.forName;
import static org.springframework.util.ClassUtils.getDefaultClassLoader;

@Slf4j
public final class TestCacheListenerExtender {

    private static boolean isDone = false;

    private TestCacheListenerExtender() {
        // leave empty
    }

    public static void registerListeners() throws ClassNotFoundException {
        if (isDone) {
            return;
        }

        ApplicationContext context = ApplicationContextHolder.getContext();
        NamedCacheProvider cacheProvider = context.getBean(NamedCacheProvider.class);
        if (cacheProvider.isCacheEnabled()) {

            // first let's ensure that we process at least well-known DXA caches
            ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
            scanner.addIncludeFilter(new AssignableTypeFilter(SimpleCacheWrapper.class));
            for (BeanDefinition beanDefinition : scanner.findCandidateComponents("com.sdl")) {
                Class<?> aClass = forName(beanDefinition.getBeanClassName(), getDefaultClassLoader());
                SimpleCacheWrapper cacheWrapper = (SimpleCacheWrapper) context.getBean(aClass);
                cacheWrapper.getCache();
            }

            // now let's add out listeners
            MutableCacheEntryListenerConfiguration<Object, Object> listenerConfiguration =
                    new MutableCacheEntryListenerConfiguration<>(
                            FactoryBuilder.factoryOf(new NeverCacheListener<>()),
                            FactoryBuilder.factoryOf(new OnlyCreatedFilter<>()),
                            false, true);
            //noinspection unchecked
            cacheProvider.getOwnCaches().forEach(cache -> cache.registerCacheEntryListener(listenerConfiguration));
            isDone = true;
        }
    }

}
