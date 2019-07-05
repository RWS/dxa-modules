package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.webapp.common.api.localization.Localization;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

public interface PublicationService {
    @Cacheable("ish")
    List<Publication> getPublicationList(Localization localization);

    @Cacheable("ish")
    void checkPublicationOnline(int publicationId, Localization localization);
}
