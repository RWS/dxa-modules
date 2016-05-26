package com.sdl.dxa.modules.mediamanager.model;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;

import static com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution.CUSTOM_PLAYER_VIEW_PREFIX;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

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
    public void shouldReturnDisplayIdForJsonIfClientSideIsEnabled() {
        //given
        MediaManagerDistribution distribution = new MediaManagerDistribution();
        ReflectionTestUtils.setField(distribution, "displayTypeId", "test");
        distribution.setPlayerType("Custom");

        //when
        String displayTypeId = distribution.getViewName();

        //then
        assertEquals(CUSTOM_PLAYER_VIEW_PREFIX + "test", displayTypeId);

        //when
        distribution.setPlayerType("custom");
        displayTypeId = distribution.getViewName();

        //then
        assertEquals("Case should not matter", CUSTOM_PLAYER_VIEW_PREFIX + "test", displayTypeId);

        //when
        distribution.setPlayerType(null);
        displayTypeId = distribution.getViewName();

        //then
        assertEquals("And should get displayTypeId value if nothing special", "test", displayTypeId);

        //when
        distribution.setPlayerType("standard");
        displayTypeId = distribution.getViewName();

        //then
        assertEquals("And should get displayTypeId value if custom is disabled", "test", displayTypeId);
    }

    @Test
    public void shouldReturnIsSubtitled() {
        //given
        MediaManagerDistribution distribution = new MediaManagerDistribution();

        //when
        distribution.setVideoSubtitles("Enabled");
        //then
        assertTrue(distribution.isSubtitled());

        //when
        distribution.setVideoSubtitles("Disabled");
        //then
        assertFalse(distribution.isSubtitled());

        //when
        distribution.setVideoSubtitles(null);
        //then
        assertFalse(distribution.isSubtitled());
    }

    @Test
    public void shouldReturnIsAutoplayed() {
        //given
        MediaManagerDistribution distribution = new MediaManagerDistribution();

        //when
        distribution.setVideoAutoPlay("Enabled");
        //then
        assertTrue(distribution.isAutoPlayed());

        //when
        distribution.setVideoAutoPlay("Disabled");
        //then
        assertFalse(distribution.isAutoPlayed());

        //when
        distribution.setVideoAutoPlay(null);
        //then
        assertFalse(distribution.isAutoPlayed());
    }
}