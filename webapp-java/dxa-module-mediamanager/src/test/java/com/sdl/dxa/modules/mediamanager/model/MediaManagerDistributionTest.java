package com.sdl.dxa.modules.mediamanager.model;

import org.junit.Test;

import java.util.HashMap;

import static org.junit.Assert.assertEquals;

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
    public void shouldGetIconClass() {
        //given


        //when

        //then

    }
}