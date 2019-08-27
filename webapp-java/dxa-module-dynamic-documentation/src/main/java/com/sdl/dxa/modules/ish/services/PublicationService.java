package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.webapp.common.api.localization.Localization;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

public interface PublicationService {
    List<Publication> getPublicationList(Localization localization);

    void checkPublicationOnline(int publicationId, Localization localization);
}
