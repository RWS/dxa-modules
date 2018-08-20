package com.sdl.dxa.modules.docs.search.service;

import com.sdl.delivery.iq.query.api.Criteria;
import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchParameters;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Test for SearcherConfigurer class.
 */
public class SearcherConfigurerTest {
    private static final Integer PUBLICATION_ID = 123123;

    private SearcherConfigurer configurer = new SearcherConfigurer();

    @Test
    public void testBuildCriteria() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"group\",\"keys\":" +
            "[\"publicationId\",\"dynamic.FISHDITADLVRREMOTESTATUS.lng.element\",\"content.english\"]," +
            "\"values\":[\"123123\",\"VDITADLVRREMOTESTATUSONLINE\",\"some query\"],\"termTypes\":" +
            "[\"EXACT\",\"EXACT\",\"EXACT\"],\"boostValues\":[\"0.0\",\"0.0\",\"0.0\"]," +
            "\"types\":[\"INTEGER\",\"STRING\",\"STRING\"]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setPublicationId(PUBLICATION_ID);
        parameters.setSearchQuery("some query");
        parameters.setLanguage("en");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test
    public void testBuildCriteriaForExactSearch() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"group\",\"keys\":" +
                "[\"publicationId\",\"dynamic.FISHDITADLVRREMOTESTATUS.lng.element\",\"content.english\"]," +
                "\"values\":[\"123123\",\"VDITADLVRREMOTESTATUSONLINE\",\"some query\"],\"termTypes\":" +
                "[\"EXACT\",\"EXACT\",\"EXACT\"],\"boostValues\":[\"0.0\",\"0.0\",\"0.0\"],\"types\":" +
                "[\"INTEGER\",\"STRING\",\"STRING\"]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setPublicationId(PUBLICATION_ID);
        parameters.setSearchQuery("\"some query\"");
        parameters.setLanguage("en");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test
    public void testBuildCriteriaFor5CharLanguage() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"group\",\"keys\":" +
                "[\"publicationId\",\"dynamic.FISHDITADLVRREMOTESTATUS.lng.element\",\"content.english\"]," +
                "\"values\":[\"123123\",\"VDITADLVRREMOTESTATUSONLINE\",\"some query\"],\"termTypes\":" +
                "[\"EXACT\",\"EXACT\",\"EXACT\"],\"boostValues\":[\"0.0\",\"0.0\",\"0.0\"],\"types\":" +
                "[\"INTEGER\",\"STRING\",\"STRING\"]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setPublicationId(PUBLICATION_ID);
        parameters.setSearchQuery("\"some query\"");
        parameters.setLanguage("eN-Us");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testBuildCriteriaIncorrectParameters() throws SearchException {
        SearchParameters parameters = new SearchParameters();
        configurer.buildCriteria(parameters);
    }
}
