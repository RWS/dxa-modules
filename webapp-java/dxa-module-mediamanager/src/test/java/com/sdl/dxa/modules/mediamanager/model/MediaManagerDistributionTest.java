package com.sdl.dxa.modules.mediamanager.model;

import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class MediaManagerDistributionTest {

    @Test
    public void shouldGetGlobalIdWhenExternalMetadatIsNull() throws Exception {
        //given
        final MediaManagerDistribution mediaManagerDistribution = new MediaManagerDistribution();
        mediaManagerDistribution.setUrl("http://google.com?o=123");

        //when
        final String globalId = mediaManagerDistribution.getGlobalId();

        //then
        assertEquals("123", globalId);
    }

    @Test
    public void shouldGetGlobalIdWhenExternalMetadataIsFull() {
        //given
        final String expected = "qwerty";
        final MediaManagerDistribution distribution = new MediaManagerDistribution();
        final HashMap<String, Object> metadata = new HashMap<>();
        metadata.put("GlobalId", expected);
        distribution.setExternalMetadata(metadata);

        //when
        final String globalId = distribution.getGlobalId();

        //then
        assertEquals(expected, globalId);
    }

    @Test
    public void shouldGetGlobalIdWhenExternalMetadataHasNoKey() {
        //given
        final String expected = "123";
        final MediaManagerDistribution distribution = new MediaManagerDistribution();
        distribution.setExternalMetadata(new HashMap<String, Object>() {{
            put("qwe", "qwe");
        }});
        distribution.setUrl("http://google.com?o=123");

        //when
        final String globalId = distribution.getGlobalId();

        //then
        assertEquals(expected, globalId);
    }

    @Test
    public void shouldGetGlobalIdWhenExternalMetadataIsEmptyButNotNull() {
        //given
        final String expected = "123";
        final MediaManagerDistribution distribution = new MediaManagerDistribution();
        distribution.setExternalMetadata(new HashMap<String, Object>());
        distribution.setUrl("http://google.com?o=123");

        //when
        final String globalId = distribution.getGlobalId();

        //then
        assertEquals(expected, globalId);
    }

    @Test
    public void shouldReturnDistributionUrlWellFormatted() {
        //given
        final String expected = "http://google.com/json/123";
        final MediaManagerDistribution distribution = new MediaManagerDistribution();
        distribution.setUrl("http://google.com?o=123");

        //when
        final String distributionJsonUrl = distribution.getDistributionJsonUrl();

        //then
        assertEquals(expected, distributionJsonUrl);
    }

    @Test
    public void shouldReturnWellFormattedEmbedScriptUrl() {
        //given
        final String expected = "http://google.com/distributions/embed?o=123";
        final MediaManagerDistribution distribution = new MediaManagerDistribution();
        distribution.setUrl("http://google.com/distributions/?o=123");

        //when
        String embedScriptUrl = distribution.getEmbedScriptUrl();

        //then
        assertEquals(expected, embedScriptUrl);

        //when
        distribution.setUrl("http://google.com/distributions?o=123");

        //when
        embedScriptUrl = distribution.getEmbedScriptUrl();

        //then
        assertEquals(expected, embedScriptUrl);
    }

    @Test
    public void shouldReturnIsSubtitled() {
        //given
        MediaManagerDistribution distribution = new MediaManagerDistribution();

        //when
        distribution.setCustomVideoSubtitles("Enabled");
        //then
        assertTrue(distribution.isSubtitled());

        //when
        distribution.setCustomVideoSubtitles("Disabled");
        //then
        assertFalse(distribution.isSubtitled());

        //when
        distribution.setCustomVideoSubtitles(null);
        //then
        assertFalse(distribution.isSubtitled());
    }

    @Test
    public void shouldReturnIsAutoplayed() {
        //given
        MediaManagerDistribution distribution = new MediaManagerDistribution();

        //when
        distribution.setCustomVideoAutoPlay("Enabled");
        //then
        assertTrue(distribution.isAutoPlayed());

        //when
        distribution.setCustomVideoAutoPlay("Disabled");
        //then
        assertFalse(distribution.isAutoPlayed());

        //when
        distribution.setCustomVideoAutoPlay(null);
        //then
        assertFalse(distribution.isAutoPlayed());
    }

    @Test
    public void shouldReadFromXhtmlElement() {
        //given
        MediaManagerDistribution distribution = new MediaManagerDistribution();
        Node node = mock(Node.class);

        NamedNodeMap namedNodeMap = mock(NamedNodeMap.class);
        when(namedNodeMap.getNamedItem(anyString())).thenAnswer(new Answer<Node>() {
            @Override
            public Node answer(InvocationOnMock invocation) throws Throwable {
                Node node = mock(Node.class);
                String key = (String) invocation.getArguments()[0];
                String result;
                switch (key) {
                    case "xlink:href":
                        result = "0-1";
                        break;
                    case "data-multimediaFileSize":
                        result = "42";
                        break;
                    default:
                        result = key;
                        break;
                }
                when(node.getNodeValue()).thenReturn(result);
                return node;
            }
        });
        when(node.getAttributes()).thenReturn(namedNodeMap);

        //when
        distribution.readFromXhtmlElement(node);

        //then
        assertEquals("data-playerType", distribution.getPlayerType());
        assertEquals("data-customVideoAutoplay", distribution.getCustomVideoAutoPlay());
        assertEquals("data-customVideoSubtitles", distribution.getCustomVideoSubtitles());
        assertEquals("data-customVideoControls", distribution.getCustomVideoControls());
    }

    @Test
    public void shouldDetectCustomView() {
        //given 
        MediaManagerDistribution distribution = new MediaManagerDistribution();

        //then
        assertFalse(distribution.isCustomView());

        //when
        distribution.setPlayerType("custom");
        //then
        assertTrue(distribution.isCustomView());
    }
}