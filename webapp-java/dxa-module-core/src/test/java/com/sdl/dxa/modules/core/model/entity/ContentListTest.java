package com.sdl.dxa.modules.core.model.entity;

import com.google.common.collect.ImmutableMap;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.entity.Tag;
import com.sdl.webapp.common.api.model.query.ComponentMetadata;
import com.sdl.webapp.common.api.model.query.SimpleBrokerQuery;
import org.jetbrains.annotations.NotNull;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ContentListTest {

    private static final Tag CONTENT_TYPE = mock(Tag.class);

    private static final Tag SORT = mock(Tag.class);

    private static final Link LINK = mock(Link.class);

    @Before
    public void before() {
        when(CONTENT_TYPE.getKey()).thenReturn("json");
    }

    @Test
    public void shouldReturnHeadLine() {
        //given
        ContentList contentList = new ContentList();
        contentList.setHeadline("ContentListHeadLine");
        //then
        assertEquals("ContentListHeadLine", contentList.getHeadline());
    }

    @Test
    public void shouldReturnLink() {
        //given
        ContentList contentList = new ContentList();
        Link link = mock(Link.class);
        contentList.setLink(link);
        //then
        assertEquals(link, contentList.getLink());
    }

    @Test
    public void shouldReturnPageSize() {
        //given
        ContentList contentList = new ContentList();
        contentList.setPageSize(100);
        //then
        assertEquals(100, contentList.getPageSize());
    }

    @Test
    public void shouldReturnStart() {
        //given
        ContentList contentList = new ContentList();
        contentList.setStart(1);
        //then
        assertEquals(1, contentList.getStart());
    }

    @Test
    public void shouldReturnCurrentPage() {
        //given
        ContentList contentList = new ContentList();
        contentList.setCurrentPage(2);
        //then
        assertEquals(2, contentList.getCurrentPage());
    }

    @Test
    public void shouldReturnHasMore() {
        //given
        ContentList contentList = new ContentList();
        contentList.setHasMore(true);
        //then
        assertEquals(true, contentList.isHasMore());
    }

    @Test
    public void shouldReturnSort() {
        //given
        ContentList contentList = new ContentList();
        Tag tag = mock(Tag.class);
        contentList.setSort(tag);
        //then
        assertEquals(tag, contentList.getSort());
    }

    @Test
    public void shouldReturnContentType() {
        //given
        ContentList contentList = new ContentList();
        Tag tag = mock(Tag.class);
        contentList.setContentType(tag);
        //then
        assertEquals(tag, contentList.getContentType());
    }

    @Test
    public void shouldReturnItemListElements() {
        //given
        ContentList contentList = new ContentList();
        contentList.setItemListElements(new ArrayList<Teaser>());
        //then
        assertEquals(new ArrayList<>(), contentList.getItemListElements());
    }

    @Test
    public void shouldReturnToString() {
        //given
        ContentList contentList = getFilledContentList();
        //then
        assertEquals("ContentList(" +
                        "headline=" + "ContentListHeadLine" +
                        ", link=" + LINK.toString() +
                        ", pageSize=" + 100 +
                        ", contentType=" + CONTENT_TYPE.toString() +
                        ", sort=" + SORT.toString() +
                        ", currentPage=" + 2 +
                        ", hasMore=" + true +
                        ", itemListElements=" + new ArrayList<>().toString() +
                        ")",
                contentList.toString());
    }

    @Test
    public void shouldSetCurrentPageWhenStartIsSet() {
        //given
        ContentList contentList = new ContentList();
        contentList.setPageSize(5);
        contentList.setStart(10);

        //when
        int currentPage = contentList.getCurrentPage();

        //then
        assertEquals(3, currentPage);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldThrowIAEIfPageSizeIsZero() {
        //given
        ContentList contentList = new ContentList();
        contentList.setPageSize(0);

        //when
        contentList.setStart(10);

        //then
        //IAE
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldThrowIAEIfPageSizeIsLessThanZero() {
        //given
        ContentList contentList = new ContentList();
        contentList.setPageSize(-10);

        //when
        contentList.setStart(10);

        //then
        //IAE
    }

    @Test
    public void shouldCreateQueryFromItself() {
        //given
        @NotNull ContentList contentList = getFilledContentList();
        Localization localization = mock(Localization.class);
        when(localization.getId()).thenReturn("42");
        when(localization.getConfiguration(eq("core.schemas.json"))).thenReturn("43");

        //when
        SimpleBrokerQuery query = contentList.getQuery(localization);

        //then
        assertEquals(contentList.getStart(), query.getStartAt());
        assertEquals(42, query.getPublicationId());
        assertEquals(contentList.getPageSize(), query.getPageSize());
        assertEquals(43, query.getSchemaId());
        assertEquals(SORT.getKey(), query.getSort());
    }

    @NotNull
    private ContentList getFilledContentList() {
        ContentList contentList = new ContentList();
        contentList.setHeadline("ContentListHeadLine");
        contentList.setLink(LINK);
        contentList.setPageSize(100);
        contentList.setContentType(CONTENT_TYPE);
        contentList.setSort(SORT);
        contentList.setCurrentPage(2);
        contentList.setHasMore(true);
        contentList.setItemListElements(new ArrayList<Teaser>());
        return contentList;
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void shouldReturnTeaser() {
        //given
        ContentList contentList = new ContentList();

        Link link = new Link();
        link.setUrl("url");

        Teaser expected1 = new Teaser();
        String headline1 = "Name";
        Date date1 = new Date();
        String introText1 = "IntroText";
        expected1.setDate(new DateTime(date1));
        expected1.setHeadline(headline1);
        expected1.setText(new RichText(introText1));
        expected1.setLink(link);

        Teaser expected2 = new Teaser();
        Date date2 = new Date();
        String title2 = "Title";
        expected2.setDate(new DateTime(date2));
        expected2.setHeadline(title2);
        expected2.setText(new RichText((String) null));
        expected2.setLink(link);

        //when
        Teaser nullTeaser = contentList.getEntity(null);

        Teaser allFields = contentList.getEntity(ComponentMetadata.builder()
                .publicationId("1")
                .id("2")
                .componentUrl("url")
                .custom(ImmutableMap.<String, Object>of("dateCreated", date1, "name", headline1, "introText", introText1))
                .build());

        Teaser noFields = contentList.getEntity(ComponentMetadata.builder()
                .publicationId("1")
                .id("2")
                .componentUrl("url")
                .lastPublicationDate(date2)
                .title(title2)
                .build());

        //then
        assertNull(nullTeaser);
        assertEquals(expected1, allFields);
        assertEquals(expected2, noFields);
    }

    @Test
    public void shouldSetItemListWithQueryResults() {
        //given
        ContentList contentList = new ContentList();
        List<Teaser> list = new ArrayList<Teaser>() {{
            add(new Teaser());
        }};

        //when
        contentList.setQueryResults(list);
        List<Teaser> queryResults = contentList.getQueryResults();
        List<Teaser> itemListElements = contentList.getItemListElements();

        //then
        assertSame(list, queryResults);
        assertSame(list, itemListElements);
    }

}