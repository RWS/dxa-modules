package com.sdl.dxa.modules.core.model.entity;

import com.sdl.webapp.common.api.formatters.support.FeedItem;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.Link;
import org.jetbrains.annotations.NotNull;
import org.joda.time.DateTime;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;

public class TeaserTest {

    @Test
    public void shouldHaveCustomGetterForTestEnsuringAlwaysNotNullRichText() {
        //given
        Teaser teaser = new Teaser();

        Teaser teaser2 = new Teaser();
        RichText richText = new RichText("hello");
        teaser2.setText(richText);

        //when
        RichText text = teaser.getText();
        RichText text2 = teaser2.getText();

        //then
        assertNotNull(text);
        assertNotNull(text2);
        assertSame(richText, text2);
    }

    @Test
    public void shouldReturnFeedItem() {
        //given
        DateTime dateTime = new DateTime();
        Link link = new Link();
        Teaser teaser = getTeaser(dateTime, link);

        //when
        List<FeedItem> list = teaser.extractFeedItems();

        //then
        FeedItem feedItem = list.get(0);
        assertEquals("1", feedItem.getHeadline());
        assertEquals(new RichText("2"), feedItem.getSummary());
        assertEquals(dateTime.toDate(), feedItem.getDate());
        assertEquals(link, feedItem.getLink());
    }

    @Test
    public void shouldReturnFeedItemWithLinkFromMedia() {
        //given
        Teaser teaser = getTeaser(new DateTime(), null);

        //when
        List<FeedItem> list = teaser.extractFeedItems();

        //then
        FeedItem feedItem = list.get(0);
        assertNull(feedItem.getLink());
    }

    @Test
    public void shouldReturnFeedItemWithNullLink() {
        //given
        Teaser teaser = getTeaser(new DateTime(), null);
        Download media = new Download();
        media.setUrl("qwe");
        teaser.setMedia(media);

        //when
        List<FeedItem> list = teaser.extractFeedItems();

        //then
        FeedItem feedItem = list.get(0);
        assertEquals("qwe", feedItem.getLink().getUrl());
    }

    @NotNull
    private Teaser getTeaser(DateTime dateTime, Link link) {
        Teaser teaser = new Teaser();
        teaser.setHeadline("1");
        teaser.setText(new RichText("2"));
        teaser.setDate(dateTime);
        if (link != null) {
            link.setUrl("qwe");
            teaser.setLink(link);
        }
        return teaser;
    }
}