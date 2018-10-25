package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.TridionDocsPublicContentApiClient;
import com.sdl.dxa.tridion.pcaclient.PCAClientProvider;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import com.sdl.webapp.common.api.WebRequestContext;

/**
 * Test for TridionDocsPublicContentApiClient class.
 */
@RunWith(MockitoJUnitRunner.class)
public class TridionDocsPublicContentApiClientTest {

    @Mock
    private WebRequestContext webRequestContext;
    
    @Mock
    private PCAClientProvider pcaClientProvider;

    @InjectMocks
    @Spy
    TridionDocsPublicContentApiClient tridionDocsPublicContentApiClient;

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
