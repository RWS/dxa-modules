package com.sdl.dxa.modules.search.service;

import com.sdl.dxa.modules.search.model.SearchItem;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;

public class SearchProviderDelegate implements SearchProvider {

    private SearchProvider searchProvider;

    @Override
    public <T extends SearchItem> void executeQuery(SearchQuery<T> searchQuery, Class<T> resultClazz, Localization localization) {
        searchProvider.executeQuery(searchQuery, resultClazz, localization);
    }

    public void setSearchProvider(SearchProvider searchProvider) {
        this.searchProvider = searchProvider;
    }
}
