package com.sdl.delivery.ish.webapp.module;

import com.sdl.web.api.meta.WebBinaryMetaFactory;
import com.sdl.web.api.meta.WebBinaryMetaFactoryImpl;
import com.sdl.webapp.tridion.BrokerDynamicComponentPresentationProvider;
import com.sdl.webapp.tridion.SpringContextConfiguration;
import org.dd4t.providers.ComponentPresentationProvider;
import org.dd4t.providers.PayloadCacheProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Spring configuration.
 */
@Configuration
@Import(SpringContextConfiguration.class)
public class IshSpringContextConfiguration {

    @Autowired
    private PayloadCacheProvider cacheProvider;

    /**
     * <p>componentPresentationProvider.</p>
     *
     * @return a {@link org.dd4t.providers.ComponentPresentationProvider} object.
     */
    @Bean
    public ComponentPresentationProvider componentPresentationProvider() {
        BrokerDynamicComponentPresentationProvider componentPresentationProvider =
                new BrokerDynamicComponentPresentationProvider();
        componentPresentationProvider.setContentIsCompressed("false");
        componentPresentationProvider.setCacheProvider(cacheProvider);
        return componentPresentationProvider;
    }

    @Bean
    public WebBinaryMetaFactory webBinaryMetaFactory() {
        return new WebBinaryMetaFactoryImpl();
    }
}
