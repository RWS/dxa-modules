package com.sdl.dxa.modules.docs.search.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.sdl.delivery.iq.query.api.Criteria;
import com.sdl.delivery.iq.query.api.QueryException;
import com.sdl.delivery.iq.query.client.DefaultSearcher;
import com.sdl.delivery.iq.query.result.SearchQueryResult;
import com.sdl.delivery.iq.query.result.SearchQueryResultSet;
import com.sdl.delivery.iq.query.result.SearchResultFilter;
import com.sdl.dxa.modules.docs.exception.SearchParametersProcessingException;
import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchParameters;
import com.sdl.dxa.modules.docs.search.model.SearchResult;
import com.sdl.dxa.modules.docs.search.model.SearchResultSet;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
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
        SearchParameters searchParameters = parseParameters(parametersJson);

        DefaultSearcher searcher = createSearcher(searchParameters);

        Criteria searchCriteria = searcherConfigurer.buildCriteria(searchParameters);
        SearchQueryResultSet result = null;
        try {
            result = searcher.search(searchCriteria);
        } catch (QueryException e) {
            log.error("Could not perform search for criteria {}", searchCriteria);
            throw new SearchException("Could not perform search for criteria " + searchCriteria, e);
        }
        return buildSearchResultSet(result, searchParameters);
    }

    DefaultSearcher createSearcher(SearchParameters parameters) throws SearchException {
        DefaultSearcher searcher = null;
        try {
            searcher = DefaultSearcher.newSearcher();
        } catch (QueryException e) {
            String message = "Could not create searcher for parameters: " + parameters;
            throw new SearchException(message, e);
        }
        searcher.withResultFilter(SearchResultFilter.create()
                        .withResultSetRange(parameters.getStartIndex(),
                                parameters.getStartIndex() + parameters.getCount()
                        )
                        .enableHighlighting()
        );
        return searcher;
    }

    SearchParameters parseParameters(String parametersJson) {
        try {
            return READER.readValue(parametersJson);
        } catch (IOException e) {
            log.error("Could not parse search parameters: " + parametersJson);
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
