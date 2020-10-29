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
            "[\"publicationId\",\"dynamic+FISHDITADLVRREMOTESTATUS.lng.element\",\"content+english\"]," +
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
                "[\"publicationId\",\"dynamic+FISHDITADLVRREMOTESTATUS.lng.element\",\"content+english\"]," +
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
                "[\"publicationId\",\"dynamic+FISHDITADLVRREMOTESTATUS.lng.element\",\"content+english\"]," +
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

    @Test
    public void testBuildCriteriaForJapanese() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"query\"," +
                "\"op\":\"AND\",\"nodes\":[{\"type\":\"field\",\"key\":\"publicationId\",\"value\":\"123123\"," +
                "\"termType\":\"EXACT\",\"fieldType\":\"INTEGER\"},{\"type\":\"field\",\"key\":" +
                "\"dynamic+FISHDITADLVRREMOTESTATUS.lng.element\",\"value\":\"VDITADLVRREMOTESTATUSONLINE\"," +
                "\"fieldType\":\"STRING\"}]},{\"type\":\"query\",\"op\":\"OR\",\"nodes\":[{\"type\":\"field\"," +
                "\"key\":\"content+cjk\",\"value\":\"some query\",\"fieldType\":\"STRING\"},{\"type\":\"field\"," +
                "\"key\":\"content+japanese\",\"value\":\"some query\",\"fieldType\":\"STRING\"}]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setPublicationId(PUBLICATION_ID);
        parameters.setSearchQuery("\"some query\"");
        parameters.setLanguage("ja-jp");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test
    public void testBuildCriteriaPubIdAndNamespaceAndSeparatorForKorean() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"query\",\"op\":" +
                "\"AND\",\"nodes\":[{\"type\":\"field\",\"key\":\"publicationId\",\"value\":\"123123\"," +
                "\"termType\":\"EXACT\",\"fieldType\":\"INTEGER\"},{\"type\":\"field\",\"key\":\"namespace\"," +
                "\"value\":\"9987\",\"termType\":\"EXACT\",\"fieldType\":\"STRING\"}]},{\"type\":\"query\"," +
                "\"op\":\"AND\",\"nodes\":[{\"type\":\"field\",\"key\":\"dynamic#FISHDITADLVRREMOTESTATUS.lng.element\"," +
                "\"value\":\"VDITADLVRREMOTESTATUSONLINE\",\"fieldType\":\"STRING\"},{\"type\":\"query\"," +
                "\"op\":\"OR\",\"nodes\":[{\"type\":\"field\",\"key\":\"content#cjk\",\"value\":\"notAQuery\"," +
                "\"fieldType\":\"STRING\"},{\"type\":\"field\",\"key\":\"content#korean\",\"value\":\"notAQuery\"," +
                "\"fieldType\":\"STRING\"}]}]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setPublicationId(PUBLICATION_ID);
        parameters.setSearchQuery("notAQuery");
        parameters.setLanguage("ko-ko");
        parameters.setIqNamespace("9987");
        parameters.setIqSeparator("#");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test
    public void testBuildCriteriaForChinese() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"field\",\"key\":" +
                "\"dynamic+FISHDITADLVRREMOTESTATUS.lng.element\",\"value\":\"VDITADLVRREMOTESTATUSONLINE\"," +
                "\"fieldType\":\"STRING\"},{\"type\":\"query\",\"op\":\"OR\",\"nodes\":[{\"type\":\"field\"," +
                "\"key\":\"content+cjk\",\"value\":\"some query\",\"fieldType\":\"STRING\"},{\"type\":\"field\"," +
                "\"key\":\"content+chinese\",\"value\":\"some query\",\"fieldType\":\"STRING\"}]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setSearchQuery("\"some query\"");
        parameters.setLanguage("zh-tw");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test
    public void testBuildCriteriaForKorean() throws SearchException {
        final String expected = "{\"type\":\"query\",\"op\":\"AND\",\"nodes\":[{\"type\":\"field\",\"key\":" +
                "\"dynamic+FISHDITADLVRREMOTESTATUS.lng.element\",\"value\":\"VDITADLVRREMOTESTATUSONLINE\"," +
                "\"fieldType\":\"STRING\"},{\"type\":\"query\",\"op\":\"OR\",\"nodes\":[{\"type\":\"field\"," +
                "\"key\":\"content+cjk\",\"value\":\"some query\",\"fieldType\":\"STRING\"},{\"type\":\"field\"," +
                "\"key\":\"content+korean\",\"value\":\"some query\",\"fieldType\":\"STRING\"}]}]}";
        SearchParameters parameters = new SearchParameters();
        parameters.setSearchQuery("\"some query\"");
        parameters.setLanguage("ko-KO");
        Criteria criteria = configurer.buildCriteria(parameters);
        assertEquals(expected, criteria.getRawQuery());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testBuildCriteriaIncorrectParameters() throws SearchException {
        SearchParameters parameters = new SearchParameters();
        configurer.buildCriteria(parameters);
    }
}
