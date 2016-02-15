package com.sdl.dxa.modules.search.provider.implementation;

import com.google.common.base.Strings;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.dxa.modules.search.provider.SearchProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.ViewModel;

import java.util.Map;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class AbstractSearchProvider implements SearchProvider {

    @Override
    public SearchQuery buildSearchQuery(ViewModel model, String queryText, String start,
                                        Map<String, String[]> queryStringParameters) {
        SearchQuery searchQuery = (SearchQuery) model;
        searchQuery.setQueryDetails(new SearchQuery.QueryDetails(queryText, queryStringParameters));
        searchQuery.setStart(isEmpty(start) ? 1 : Integer.parseInt(start));
        return searchQuery;
    }

    protected String getServiceUrl(Localization localization) {
        String queryUrl = localization.getConfiguration("search.queryURL");
        if (Strings.isNullOrEmpty(queryUrl)) {
            return localization.getConfiguration("search." + (localization.isStaging() ? "staging" : "live") + "IndexConfig");
        }
        return queryUrl;
    }
}
