package com.sdl.dxa.modules.search.service;

import com.sdl.dxa.modules.search.model.SearchItem;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AwsCloudSearchProvider implements SearchProvider {

    private static final Logger LOG = LoggerFactory.getLogger(SolrSearchProvider.class);

    @Override
    public <T extends SearchItem> void executeQuery(SearchQuery<T> searchQuery, Class<T> resultClazz, Localization localization) {
        LOG.debug("We are in AwsCloudSearchProvider");
    }
}
