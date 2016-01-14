package com.sdl.dxa.modules.search.provider;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SearchProviderDelegate implements SearchProvider {

    @Autowired
    private SearchProvider searchProvider;

    @Override
    public void executeQuery(SearchQuery searchQuery, Localization localization) {
        searchProvider.executeQuery(searchQuery, localization);
    }
}
