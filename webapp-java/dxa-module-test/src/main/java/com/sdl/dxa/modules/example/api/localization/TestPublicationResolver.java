package com.sdl.dxa.modules.example.api.localization;

import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.localization.LocalizationResolver;
import com.sdl.webapp.common.api.localization.LocalizationResolverException;
import com.sdl.webapp.tridion.PublicationMappingNotFoundException;
import com.sdl.webapp.tridion.TridionLocalizationResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

import java.io.UnsupportedEncodingException;

@Component
@Primary
@Profile("dxa.test.TestPublicationResolver")
@Slf4j
public class TestPublicationResolver implements LocalizationResolver {
    private final TridionLocalizationResolver delegate;

    public TestPublicationResolver() {
        delegate = new TridionLocalizationResolver();
    }

    @Override
    public Localization getLocalization(String url) throws LocalizationResolverException {
        log.error("TestPublicationResolver returns no mapping");
        throw new PublicationMappingNotFoundException("From TestPublicationResolver: Publication not found");
    }

    @Override
    public boolean refreshLocalization(Localization localization) {
        return delegate.refreshLocalization(localization);
    }
}

