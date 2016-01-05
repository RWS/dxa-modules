package com.sdl.dxa.modules.search.provider;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;

public interface SearchProvider {
    void executeQuery(SearchQuery searchQuery, Localization localization);
}
