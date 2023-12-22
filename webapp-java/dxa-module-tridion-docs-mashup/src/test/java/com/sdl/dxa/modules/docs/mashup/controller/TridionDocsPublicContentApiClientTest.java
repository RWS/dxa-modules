package com.sdl.dxa.modules.docs.mashup.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.docs.mashup.client.TridionDocsPublicContentApiClient;
import com.sdl.dxa.tridion.mapping.ModelBuilderPipeline;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.exception.GraphQLClientException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

/**
 * Test for TridionDocsPublicContentApiClient class.
 */
@ExtendWith(MockitoExtension.class)
public class TridionDocsPublicContentApiClientTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private ApiClientProvider apiClientProvider;

    @Mock
    private ApiClient apiClient;

    @Mock
    private ObjectMapper objectMapper;
    
    @Mock
    private Localization localization;

    @Mock
    private ModelBuilderPipeline modelBuilderPipeline;

    TridionDocsPublicContentApiClient tridionDocsPublicContentApiClient;

    @BeforeEach
    public void init() throws IOException, GraphQLClientException {           
        lenient().when(webRequestContext.getLocalization()).thenReturn(localization);
        lenient().when(localization.getConfiguration(TridionDocsPublicContentApiClient.TOPICS_URL_PREFIX_CONFIGNAME)).thenReturn("http://test.com");
        lenient().when(localization.getConfiguration(TridionDocsPublicContentApiClient.TOPICS_BINARYURL_PREFIX_CONFIGNAME)).thenReturn("http://test.com/binary");
        lenient().when(apiClientProvider.getClient()).thenReturn(apiClient);
        
        tridionDocsPublicContentApiClient = new TridionDocsPublicContentApiClient(webRequestContext, apiClientProvider, objectMapper, modelBuilderPipeline);
    }

    @Test
    public void getFullyQualifiedUrlForTopicTests() {
        // should be empty
        assertEquals("", tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic("", ""));

        // should be null
        assertNull(tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(null, null));

        // should have the / appended at the beginning
        // publicationId/pageId/rest
        String link = "123456/7890123/test-page";
        assertEquals("/" + link, tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(link, ""));

        // should not do anything to the link, just return it
        // /publicationId/pageId/rest
        link = "/123456/7890123/test-page";
        assertEquals(link, tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(link, ""));

        // should not do anything to the link, just return it
        // http://url/publicationId/pageId/rest
        link = "http://www.url.com/123456/7890123/test-page";
        assertEquals(link, tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic(link, ""));
    }

    @Test
    public void getLinkThrownWhenInvalidLink() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            tridionDocsPublicContentApiClient.getFullyQualifiedUrlForTopic("/test-page%", "");
        });
    }
}
