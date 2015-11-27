package com.sdl.dxa.modules.search.service;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;

public interface SearchProvider {
    void executeQuery(SearchQuery searchQuery, Class resultClazz, Localization localization);
}
