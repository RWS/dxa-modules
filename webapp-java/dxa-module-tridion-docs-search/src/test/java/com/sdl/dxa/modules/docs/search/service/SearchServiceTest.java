package com.sdl.dxa.modules.docs.search.service;

import com.sdl.delivery.iq.query.api.Criteria;
import com.sdl.delivery.iq.query.api.QueryException;
import com.sdl.delivery.iq.query.client.DefaultSearcher;
import com.sdl.delivery.iq.query.result.SearchQueryResult;
import com.sdl.delivery.iq.query.result.SearchQueryResultSet;
import com.sdl.delivery.iq.query.search.SearchQuery;
import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchParameters;
import com.sdl.dxa.modules.docs.search.model.SearchResult;
import com.sdl.dxa.modules.docs.search.model.SearchResultSet;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doReturn;

/**
 * Test for SearchService class.
 */
@RunWith(MockitoJUnitRunner.class)
public class SearchServiceTest {
    private static final String SEARCH_CONTENT = "search result content";
    private static final Integer PUBLICATION_ID = 123123;
    private static final String ID = "ish_123-456-16";
    private static final String CREATED_DATE = "11:11:12";
    private static final String MODIFIED_DATE = "12:12:12";
    private static final String PUBLICATION_TITLE = "pub title";
    private static final Integer HITS = 123;
    private static final Integer COUNT = 13;
    private static final Integer START_INDEX = 3;
    private static final String SEARCH_QUERY = "Connector for headsets";
    private static final String LANGUAGE = "en";


    @Mock
    private DefaultSearcher searcher;

    @Mock
    private SearcherConfigurer configurer;

    @Spy
    @InjectMocks
    private SearchService service = new SearchService();

    @Test
    public void testConvertQueryResult() {
        SearchQueryResult queryResult = new SearchQueryResult();
        queryResult.setContent(SEARCH_CONTENT);
        queryResult.setPublicationId(PUBLICATION_ID);
        queryResult.setId(ID);
        queryResult.setCreatedDate(CREATED_DATE);
        queryResult.setModifiedDate(MODIFIED_DATE);
        queryResult.setLocale(Locale.ENGLISH);
        queryResult.setPublicationTitle(PUBLICATION_TITLE);

        SearchResult result = service.convertQueryResult(queryResult);
        assertEquals(SEARCH_CONTENT, result.getContent());
        assertEquals(PUBLICATION_ID, result.getPublicationId());
        assertEquals(ID, result.getId());
        assertEquals(CREATED_DATE, result.getCreatedDate());
        assertEquals(MODIFIED_DATE, result.getModifiedDate());
        assertEquals(Locale.ENGLISH, result.getLocale());
        assertEquals(PUBLICATION_TITLE, result.getPublicationTitle());
    }

    @Test
    public void testBuildSearchResultSet() {
        SearchQueryResultSet queryResultSet = new SearchQueryResultSet();
        queryResultSet.setHits(HITS);
        queryResultSet.setQueryResults(Arrays.asList(new SearchQueryResult(), new SearchQueryResult()));
        SearchParameters searchParameters = new SearchParameters();
        searchParameters.setCount(COUNT);
        searchParameters.setStartIndex(START_INDEX);

        SearchResultSet resultSet = service.buildSearchResultSet(queryResultSet, searchParameters);
        assertEquals(HITS, resultSet.getHits());
        assertEquals(2, resultSet.getQueryResults().size());
        assertEquals(COUNT, resultSet.getCount());
        assertEquals(START_INDEX, resultSet.getStartIndex());
    }

    @Test
    public void testParseParameters() {
        final String parameters = "{\n" +
                "  \"PublicationId\" : 123123,\n" +
                "  \"Language\" : \"en\",\n" +
                "  \"SearchQuery\" : \"Connector for headsets\",\n" +
                "  \"StartIndex\" : 3,\n" +
                "  \"Count\" : 13\n" +
                "}";

        SearchParameters result = service.parseParameters(parameters);
        assertEquals(PUBLICATION_ID, result.getPublicationId());
        assertEquals(LANGUAGE, result.getLanguage());
        assertEquals(SEARCH_QUERY, result.getSearchQuery());
        assertEquals(START_INDEX, result.getStartIndex());
        assertEquals(COUNT, result.getCount());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testParseParametersIncorrectJson() {
        final String parameters = "{asdfd...";
        service.parseParameters(parameters);
    }

    @Test
    public void testSearch() throws SearchException, QueryException {
        final String parameters = "{\n" +
                "  \"PublicationId\" : 123123,\n" +
                "  \"Language\" : \"en\",\n" +
                "  \"SearchQuery\" : \"Connector for headsets\",\n" +
                "  \"StartIndex\" : 3,\n" +
                "  \"Count\" : 13\n" +
                "}";

        SearchQueryResultSet resultSet = new SearchQueryResultSet();
        resultSet.setHits(HITS);
        resultSet.setQueryResults(Collections.EMPTY_LIST);
        Criteria criteria = SearchQuery.newQuery().id(ID).compile();
        doReturn(searcher).when(service).createSearcher(any(SearchParameters.class));
        doReturn(criteria).when(configurer).buildCriteria(any(SearchParameters.class));
        doReturn(resultSet).when(searcher).search(criteria);

        SearchResultSet result = service.search(parameters);

        assertEquals(HITS, result.getHits());
        assertEquals(START_INDEX, result.getStartIndex());
        assertEquals(COUNT, result.getCount());
        assertEquals(0, result.getQueryResults().size());
    }
}
