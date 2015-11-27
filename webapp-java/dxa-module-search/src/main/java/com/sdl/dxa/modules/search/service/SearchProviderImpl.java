package com.sdl.dxa.modules.search.service;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;
import org.springframework.stereotype.Service;

@Service
public class SearchProviderImpl implements SearchProvider {
    @Override
    public void executeQuery(SearchQuery searchQuery, Class resultClazz, Localization localization) {
        int a = 1;
    }
}
