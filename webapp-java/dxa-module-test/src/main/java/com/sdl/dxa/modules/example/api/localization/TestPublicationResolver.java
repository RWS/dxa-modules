package com.sdl.dxa.modules.example.api.localization;

import com.sdl.webapp.tridion.AbstractTridionLocalizationResolver;
import com.sdl.webapp.tridion.PublicationMappingNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Primary
@Profile("test.publication.resolver")
@Slf4j
public class TestPublicationResolver extends AbstractTridionLocalizationResolver {

    @Override
    protected PublicationMappingData getPublicationMappingData(String s) throws PublicationMappingNotFoundException {
        log.error("TestPublicationResolver returns no mapping");
        throw new PublicationMappingNotFoundException("From TestPublicationResolver: Publication not found");
    }
}

