package com.sdl.dxa.modules.ish.services;

import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.ViewModel;
import org.springframework.cache.annotation.Cacheable;

public interface PageService {
    @Cacheable(value = "ish", key = "{ #localization.id, #pageId }", condition = "#localization != null && #localization.id != null")
    ViewModel getPage(int pageId, Localization localization) throws ContentProviderException;
}
