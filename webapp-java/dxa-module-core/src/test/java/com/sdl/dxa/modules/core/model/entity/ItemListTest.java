package com.sdl.dxa.modules.core.model.entity;

import com.sdl.webapp.common.api.formatters.support.FeedItem;
import org.joda.time.DateTime;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ItemListTest {

    @SuppressWarnings("unchecked")
    @Test
    public void shouldExtractTeasersAsFeedItems() {
        //given
        ItemList itemList = new ItemList();
        List<Teaser> list = new ArrayList<Teaser>() {{
            Teaser teaser = new Teaser();
            teaser.setHeadline("1");
            teaser.setDate(new DateTime());
            add(teaser);

            teaser = new Teaser();
            teaser.setHeadline("2");
            teaser.setDate(new DateTime());
            add(teaser);
        }};
        itemList.setItemListElements(list);

        //when
        List<FeedItem> feedItems = itemList.extractFeedItems();

        //then
        assertEquals("1", feedItems.get(0).getHeadline());
        assertEquals("2", feedItems.get(1).getHeadline());
    }
}