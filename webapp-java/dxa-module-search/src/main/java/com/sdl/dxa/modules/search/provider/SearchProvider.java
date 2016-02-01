package com.sdl.dxa.modules.search.provider;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.ViewModel;

import java.util.Map;

public interface SearchProvider {
    SearchQuery buildSearchQuery(ViewModel model, String queryText, String start, Map<String, String[]> queryStringParameters);
    void executeQuery(SearchQuery searchQuery, Localization localization);
}
