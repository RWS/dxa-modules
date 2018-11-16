package com.sdl.dxa.modules.docs.mashup.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.docs.mashup.client.TridionDocsPublicContentApiClient;
import com.sdl.web.pca.client.exception.GraphQLClientException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import java.io.IOException;
import org.junit.Before;
import static org.mockito.Mockito.when;

/**
 * Test for TridionDocsPublicContentApiClient class.
 */
@RunWith(MockitoJUnitRunner.class)
public class TridionDocsPublicContentApiClientTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private com.sdl.web.pca.client.ApiClient apiClient;

    @Mock
    private ObjectMapper objectMapper;
    
    @Mock
    private Localization localization;

    TridionDocsPublicContentApiClient tridionDocsPublicContentApiClient;

    @Before
    public void init() throws IOException, GraphQLClientException {           
        when(webRequestContext.getLocalization()).thenReturn(localization);
        when(localization.getConfiguration(TridionDocsPublicContentApiClient.TOPICS_URL_PREFIX_CONFIGNAME)).thenReturn("http://test.com");
        when(localization.getConfiguration(TridionDocsPublicContentApiClient.TOPICS_BINARYURL_PREFIX_CONFIGNAME)).thenReturn("http://test.com/binary");
        
        tridionDocsPublicContentApiClient = new TridionDocsPublicContentApiClient(webRequestContext, apiClient, objectMapper);
    }

    @Test
    public void getFullyQualifiedUrlForTopicTests() {
        // should be empty
        Assert.assertEquals("", tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic("", ""));

        // should be null
        Assert.assertNull(tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(null, null));

        // should have the / appended at the beginning
        // publicationId/pageId/rest
        String link = "123456/7890123/test-page";
        Assert.assertEquals("/" + link, tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(link, ""));

        // should not do anything to the link, just return it
        // /publicationId/pageId/rest
        link = "/123456/7890123/test-page";
        Assert.assertEquals(link, tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(link, ""));

        // should not do anything to the link, just return it
        // http://url/publicationId/pageId/rest
        link = "http://www.url.com/123456/7890123/test-page";
        Assert.assertEquals(link, tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(link, ""));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getLinkThrownWhenInvalidLink() {
        tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic("/test-page%", "");
    }
}
