package com.sdl.dxa.modules.docs.search.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.sdl.delivery.iq.query.api.Criteria;
import com.sdl.delivery.iq.query.api.QueryException;
import com.sdl.delivery.iq.query.client.DefaultSearcher;
import com.sdl.delivery.iq.query.result.SearchQueryResult;
import com.sdl.delivery.iq.query.result.SearchQueryResultSet;
import com.sdl.delivery.iq.query.result.SearchResultFilter;
import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchParameters;
import com.sdl.dxa.modules.docs.search.model.SearchResult;
import com.sdl.dxa.modules.docs.search.model.SearchResultSet;
import com.sdl.webapp.common.controller.exception.SearchParametersProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/**
 * SearchService class responsible of performing search by given parameters in UDP search service.
 */
@Slf4j
@Component
public class SearchService {
    private static final ObjectReader READER = new ObjectMapper().readerFor(SearchParameters.class);

    @Autowired
    private SearcherConfigurer searcherConfigurer;

    /**
     * Performs search by using UDP search service with given search parameters in string json.
     *
     * @param parametersJson String json representation of search parameters.
     * @return Search Result Set of found items.
     */
    public SearchResultSet search(String parametersJson) throws SearchException {
        return search(parametersJson, null);
    }

    public SearchResultSet search(String parametersJson, ServletContext context) throws SearchException {
        SearchParameters searchParameters = parseParameters(parametersJson);
        DefaultSearcher searcher = createSearcher(searchParameters);
        if (context != null) {
            searchParameters.setIqNamespace((String) context.getAttribute("iq-namespace"));
            searchParameters.setIqSeparator((String) context.getAttribute("iq-field-separator"));
        }
        Criteria searchCriteria = searcherConfigurer.buildCriteria(searchParameters);
        SearchQueryResultSet result = null;
        QueryException[] exception = new QueryException[1];
        try {
            result = getSearchResultsWithRetry(searcher, searchCriteria, 3, exception);
        } catch (Exception e) {
            log.error("Could not perform search for parameters {}", parametersJson, e);
            throw new SearchException("Could not perform search for parameters " + parametersJson, e);
        }
        return buildSearchResultSet(result, searchParameters);
    }

    private SearchQueryResultSet getSearchResultsWithRetry(DefaultSearcher searcher,
                                                           Criteria searchCriteria,
                                                           int attempt,
                                                           Exception[] exception) throws QueryException {
        while (attempt > 0) {
            attempt--;
            try {
                return searcher.search(searchCriteria);
            } catch (Exception ex) {
                if (exception[0] == null) exception[0] = ex;
            }
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                log.error("Interrupted");
                Thread.currentThread().interrupt();
                break;
            }
        }
        throw new QueryException("Could not perform search " + searchCriteria + " after 3 attempts", exception[0]);
    }

    DefaultSearcher createSearcher(SearchParameters parameters) throws SearchException {
        try {
            DefaultSearcher searcher = DefaultSearcher.newSearcher();
            searcher.withResultFilter(SearchResultFilter
                    .create()
                    .withResultSetRange(parameters.getStartIndex(), parameters.getStartIndex() + parameters.getCount())
                    .enableHighlighting());
            return searcher;
        } catch (Exception e) {
            throw new SearchException("Could not create searcher for parameters: " + parameters, e);
        }
    }

    SearchParameters parseParameters(String parametersJson) {
        try {
            return READER.readValue(parametersJson);
        } catch (Exception e) {
            log.error("Could not parse search parameters: " + parametersJson, e);
            throw new SearchParametersProcessingException("Could not parse search parameters from String.", e);
        }
    }

    SearchResultSet buildSearchResultSet(SearchQueryResultSet resultSet, SearchParameters searchParameters) {
        SearchResultSet searchResultSet = new SearchResultSet();
        searchResultSet.setCount(searchParameters.getCount());
        searchResultSet.setStartIndex(searchParameters.getStartIndex());
        searchResultSet.setHits(resultSet.getHits());
        List<SearchQueryResult> resultList = resultSet.getQueryResults().orElse(Collections.EMPTY_LIST);
        List<SearchResult> convertedResult = new ArrayList<>();
        for (SearchQueryResult queryResult : resultList) {
            convertedResult.add(convertQueryResult(queryResult));
        }
        searchResultSet.setQueryResults(convertedResult);
        return searchResultSet;
    }

    SearchResult convertQueryResult(SearchQueryResult queryResult) {
        SearchResult result = new SearchResult();
        result.setId(queryResult.getId());
        result.setFields(queryResult.getFields().orElse(Collections.EMPTY_MAP));
        result.setLocale(queryResult.getLocale().orElse(Locale.ROOT));
        result.setContent(queryResult.getContent().orElse(""));
        result.setHighlighted(queryResult.getHighlighted().orElse(Collections.EMPTY_MAP));
        result.setCreatedDate(queryResult.getCreatedDate());
        result.setModifiedDate(queryResult.getModifiedDate());
        result.setPublicationId(queryResult.getPublicationId());
        result.setPublicationTitle(queryResult.getPublicationTitle());

        //Note: Two fields below are required by design but not yet implemented in SearchQueryResult class.
        result.setProductFamilyName(null);
        result.setProductReleaseName(null);

        return result;
    }
}
