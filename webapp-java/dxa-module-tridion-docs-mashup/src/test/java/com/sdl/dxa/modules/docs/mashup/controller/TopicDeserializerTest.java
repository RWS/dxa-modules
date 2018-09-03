package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.TopicDeserializer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

/**
 * Test for TopicDeserializer class.
 */
@RunWith(MockitoJUnitRunner.class)
public class TopicDeserializerTest {
    @Spy
    TopicDeserializer topicDeserializer;

    @Test
    public void getLinkTests() {
        // should be empty
        Assert.assertEquals("", topicDeserializer.getLink(""));

        // should be null
        Assert.assertNull(topicDeserializer.getLink(null));

        // should have the / appended at the beginning
        // publicationId/pageId/rest
        String link = "123456/7890123/test-page";
        Assert.assertEquals("/" + link, topicDeserializer.getLink(link));

        // should not do anything to the link, just return it
        // /publicationId/pageId/rest
        link = "/123456/7890123/test-page";
        Assert.assertEquals(link, topicDeserializer.getLink(link));

        // should not do anything to the link, just return it
        // http://url/publicationId/pageId/rest
        link = "http://www.url.com/123456/7890123/test-page";
        Assert.assertEquals(link, topicDeserializer.getLink(link));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getLinkThrownWhenInvalidLink() {
        topicDeserializer.getLink("/test-page%");
    }
}