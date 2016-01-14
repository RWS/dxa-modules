package com.sdl.dxa.modules.search.provider.implementation;

import com.sdl.dxa.modules.search.model.SearchItem;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.localization.Localization;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@Profile("search.solr")
public class SolrSearchProvider extends AbstractSearchProvider {

    private static final Logger LOG = LoggerFactory.getLogger(SolrSearchProvider.class);

    @Override
    public void executeQuery(SearchQuery searchQuery, Localization localization) {
        SolrQuery query = buildQuery(searchQuery, localization);

        QueryResponse response;
        try {
            response = getClient(localization).query(query);
        } catch (SolrServerException | IOException e) {
            LOG.error("Something went wrong during querying SOLR instance, so no results", e);
            return;
        }

        processResults(searchQuery, response);
    }

    private void processResults(SearchQuery searchQuery, QueryResponse response) {
        List<SearchItem> items = response.getBeans(SearchItem.class);
        searchQuery.setResults(items);
        for (SearchItem item : items) {
            Map<String, List<String>> highlights = response.getHighlighting().get(item.getId());
            String summary = getHightlights(highlights, "summary");
            item.setSummary(summary != null ? summary : ("..." + getHightlights(highlights, "body") + "..."));
        }

        searchQuery.setTotal(response.getResults().getNumFound());
    }

    private String getHightlights(Map<String, List<String>> map, String key) {
        List<String> val = map.get(key);
        if (val != null) {
            return val.get(0);
        }
        return null;
    }

    private <T extends SearchItem> SolrQuery buildQuery(SearchQuery searchQuery, Localization localization) {
        return new SolrQuery()
                    .setQuery(searchQuery.getQueryDetails().getQueryText())
                    .addFilterQuery("publicationid:" + localization.getId())
                    .setStart(searchQuery.getStart() - 1)
                    .setRows(searchQuery.getPageSize())

                    .setHighlight(true)
                    .setParam("hl.fl", "summary, body")
                    .setParam("hl.fragsize", "255")
                    .setParam("hl.simple.pre", "*")
                    .setParam("hl.simple.post", "*");
    }

    private SolrClient getClient(Localization localization) {
        return new HttpSolrClient(getServiceUrl(localization));
    }
}
