package com.sdl.dxa.modules.core.model.entity;

import com.sdl.webapp.common.api.formatters.support.FeedItem;
import com.sdl.webapp.common.api.model.RichText;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class DownloadTest {

    @Test
    public void shouldReturnFeedItem() {
        //given
        Download download = new Download();
        download.setFileName("filename");
        download.setDescription("desc");
        download.setUrl("qwe");

        //when
        List<FeedItem> feedItems = download.extractFeedItems();

        //then
        FeedItem feedItem = feedItems.get(0);
        assertEquals("filename", feedItem.getHeadline());
        assertEquals(new RichText("desc"), feedItem.getSummary());
        assertEquals("qwe", feedItem.getLink().getUrl());
    }

}