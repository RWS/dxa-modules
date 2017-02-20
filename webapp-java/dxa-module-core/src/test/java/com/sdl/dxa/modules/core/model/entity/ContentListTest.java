package com.sdl.dxa.modules.core.model.entity;

import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.entity.Tag;
import com.sdl.webapp.common.api.model.query.SimpleBrokerQuery;
import org.jetbrains.annotations.NotNull;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ContentListTest {

    private static final Tag CONTENT_TYPE = getTag();

    private static final Tag SORT = new Tag();

    private static final Link LINK = new Link();

    private static Tag getTag() {
        Tag tag = new Tag();
        tag.setKey("json");
        return tag;
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
        Tag tag = new Tag();
        contentList.setSort(tag);
        //then
        assertEquals(tag, contentList.getSort());
    }

    @Test
    public void shouldReturnContentType() {
        //given
        ContentList contentList = new ContentList();
        Tag tag = new Tag();
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

    @Test
    public void shouldSetItemListWithQueryResults() {
        //given
        ContentList contentList = new ContentList();
        List<Teaser> list = new ArrayList<Teaser>() {{
            add(new Teaser());
        }};

        //when
        contentList.setQueryResults(list, true);
        List<Teaser> queryResults = contentList.getQueryResults();
        List<Teaser> itemListElements = contentList.getItemListElements();

        //then
        assertSame(list, queryResults);
        assertSame(list, itemListElements);
        assertTrue(contentList.isHasMore());
    }

    @Test
    public void shouldReturnItsEntityType() {
        //given
        ContentList contentList = new ContentList();

        //when
        Class<Teaser> entityType = contentList.getEntityType();

        //then
        assertEquals(entityType, Teaser.class);
    }

}