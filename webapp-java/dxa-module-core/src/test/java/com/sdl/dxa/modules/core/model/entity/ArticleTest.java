package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.webapp.common.api.formatters.support.FeedItem;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class ArticleTest {

    private static Article article = new Article();

    private static DateTime time = DateTime.now();

    private static List<Paragraph> paragraphList = new ArrayList<>();

    private static Map<String, Object> xpmMetadata = new HashMap<>();

    private static Map<String, String> xpmPropertyMetadata = new HashMap<>();

    private static Image image = mock(Image.class);

    private static Paragraph paragraph = mock(Paragraph.class);

    static {
        paragraphList.add(paragraph);
        xpmMetadata.put("key", "value");
        xpmPropertyMetadata.put("key1", "value1");

        article.setId("ArticleId");
        article.setHeadline("ArticleHeadline");
        article.setDescription("ArticleDescription");
        article.setDate(time);
        article.setImage(image);
        article.setArticleBody(paragraphList);
        article.setXpmMetadata(xpmMetadata);
        article.setXpmPropertyMetadata(xpmPropertyMetadata);
    }

    @Test
    public void shouldReturnTitle() {
        //given

        //when

        //then
        assertEquals("ArticleId", article.getId());
    }

    @Test
    public void shouldReturnHeadline() {
        //given

        //when

        //then
        assertEquals("ArticleHeadline", article.getHeadline());
    }

    @Test
    public void shouldReturnDescription() {
        //given

        //when

        //then
        assertEquals("ArticleDescription", article.getDescription());
    }

    @Test
    public void shouldReturnDate() {
        //given

        //when

        //then
        assertEquals(time, article.getDate());
    }

    @Test
    public void shouldReturnImage() {
        //given

        //when

        //then
        assertEquals(image, article.getImage());
    }

    @Test
    public void shouldReturnArticleBody() {
        //given

        //when

        //then
        assertEquals(paragraphList, article.getArticleBody());
    }

    @Test
    public void shouldReturnXpmMarkup() {
        //given
        Localization localization = mock(Localization.class);

        //when

        //then
        assertEquals("<!-- Start Component Presentation: "+
                "{\"key\":\"value\"} -->",
                article.getXpmMarkup(localization).replace("\n", "").replace("\r", ""));
    }

    @Test
    public void shouldReturnXpmMetadata() {
        //given

        //when

        //then
        assertEquals(xpmMetadata, article.getXpmMetadata());
    }

    @Test
    public void shouldReturnXpmPropertyMarkup() {
        //given

        //when

        //then
        assertEquals(xpmPropertyMetadata, article.getXpmPropertyMetadata());
    }

    @Test
    public void shouldReturnFeedItem() {
        //given
        Article article = new Article();
        article.setHeadline("1");
        article.setDescription("2");
        DateTime dateTime = new DateTime();
        article.setDate(dateTime);

        //when
        List<FeedItem> list = article.extractFeedItems();

        //then
        FeedItem feedItem = list.get(0);
        assertEquals("1", feedItem.getHeadline());
        assertEquals(new RichText("2"), feedItem.getSummary());
        assertEquals(dateTime.toDate(), feedItem.getDate());
    }

    @Configuration
    @Profile("test")
    static class SpringContext {

        @Bean
        public ApplicationContextHolder applicationContextHolder() {
            return new ApplicationContextHolder();
        }

        @Bean
        public ObjectMapper objectMapper() {
            return new DxaSpringInitialization().objectMapper();
        }
    }
}