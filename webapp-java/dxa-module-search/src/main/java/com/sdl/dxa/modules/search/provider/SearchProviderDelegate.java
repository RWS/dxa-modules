package com.sdl.dxa.modules.search.provider;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;

public class SearchProviderDelegate implements SearchProvider {

    private SearchProvider searchProvider;

    @Override
    public void executeQuery(SearchQuery searchQuery, Localization localization) {
        searchProvider.executeQuery(searchQuery, localization);
    }

    public void setSearchProvider(SearchProvider searchProvider) {
        this.searchProvider = searchProvider;
    }
}
