package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.TopicDeserializer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import javax.xml.bind.ValidationException;

/**
 * Test for TopicDeserializer class.
 */
@RunWith(MockitoJUnitRunner.class)
public class TopicDeserializerTest {
    @Spy
    TopicDeserializer topicDeserializer;
    private ExpectedException thrown = ExpectedException.none();

    @Test
    public void getLinkTests() {
        // should be empty
        Assert.assertEquals("", topicDeserializer.getLink(""));

        // should be null
        Assert.assertNull(topicDeserializer.getLink(null));

        // should have the / appended at the beginning
        String link = "link_without_slash_at_beginning";
        Assert.assertEquals("/" + link, topicDeserializer.getLink(link));

        // should not do anything to the link, just return it
        link = "/link_with_slash_at_beginning";
        Assert.assertEquals(link, topicDeserializer.getLink(link));

        // should not do anything to the link, just return it
        link = "http://www.url.com/link_with_slash_at_beginning";
        Assert.assertEquals(link, topicDeserializer.getLink(link));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getLinkThrownWhenInvalidLink() {
        topicDeserializer.getLink("invalid_link%");
    }
}