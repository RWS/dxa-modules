package com.sdl.dxa.modules.ish;

import com.sdl.dxa.tridion.R2SpringConfiguration;
import com.sdl.web.api.meta.WebBinaryMetaFactory;
import com.sdl.web.api.meta.WebBinaryMetaFactoryImpl;
import com.sdl.web.api.meta.WebPublicationMetaFactory;
import com.sdl.web.api.meta.WebPublicationMetaFactoryImpl;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.filter.CharacterEncodingFilter;

/**
 * Spring configuration.
 */
@Configuration
@Import(R2SpringConfiguration.class)
public class IshSpringContextConfiguration {

    @Bean
    public WebBinaryMetaFactory webBinaryMetaFactory() {
        return new WebBinaryMetaFactoryImpl();
    }

    @Bean
    public WebPublicationMetaFactory publicationMetaFactory() {
        return new WebPublicationMetaFactoryImpl();
    }

    @Bean
    public static PropertyPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertyPlaceholderConfigurer propertyPlaceholderConfigurer = new PropertyPlaceholderConfigurer();
        Resource[] resources = new ClassPathResource[]{new ClassPathResource("ishconfig.properties")};
        propertyPlaceholderConfigurer.setLocations(resources);
        propertyPlaceholderConfigurer.setIgnoreUnresolvablePlaceholders(true);
        return propertyPlaceholderConfigurer;
    }

    @Bean
    public CharacterEncodingFilter characterEncodingFilter() {
        final CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceEncoding(true);
        return characterEncodingFilter;
    }
}
