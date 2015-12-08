package com.sdl.dxa.modules.search.provider;

import com.sdl.dxa.modules.search.model.SearchItem;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;

public interface SearchProvider {
    <T extends SearchItem> void executeQuery(SearchQuery<T>searchQuery, Class<T> resultClazz, Localization localization);
}
