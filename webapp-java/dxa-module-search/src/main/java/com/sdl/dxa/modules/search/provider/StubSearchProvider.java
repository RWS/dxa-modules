package com.sdl.dxa.modules.search.provider;

import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * This implementation is to successfully run the Spring context even in case the search Spring profile is not set.
 * Fails search immediately though.
 */
@Component
public class StubSearchProvider implements SearchProvider {

    @Override
    public SearchQuery buildSearchQuery(ViewModel model, String queryText, String start, Map<String, String[]> queryStringParameters) {
        return fail();
    }

    @Override
    public void executeQuery(SearchQuery searchQuery, Localization localization) {
        fail();
    }

    @SneakyThrows(DxaException.class)
    private <T> T fail() {
        throw new DxaException("Search Provider is not set. " +
                "Please set one of these Spring profiles to enable search module: 'search.solr' or 'search.aws'");
    }
}
