package com.sdl.dxa.modules.ugc.model.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.data.User;
import com.sdl.dxa.modules.ugc.model.JsonZonedDateTime;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import com.sdl.webapp.common.util.TcmUtils;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
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
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class UgcCommentTest {
    private static UgcComment ugcComment = new UgcComment();
    private static Comment commentData = new Comment();
    private static List<UgcComment> comments = new ArrayList<>();
    private static UgcComment otherComment = new UgcComment();
    private static DateTime time = new DateTime(new Date(1577781774000L), DateTimeZone.forID("GMT"));
    private static User user = new User();

    static {

        user.setEmailAddress("test@test.test");
        user.setName("Tester");
        user.setExternalId("ExternalId");
        user.setId("Id");
        commentData.setCreationDateTime(time);
        commentData.setLastModifiedDateTime(time);
        commentData.setContent("Comment");
        commentData.setId(1);
        commentData.setItemId(2);
        commentData.setItemPublicationId(3);
        commentData.setParentId(4);
        commentData.setItemType(TcmUtils.COMPONENT_ITEM_TYPE);
        commentData.setRating(5);
        commentData.setUser(user);

        otherComment.setCommentData(commentData);
        otherComment.setComments(comments);

        ugcComment.setCommentData(commentData);
        ugcComment.setComments(comments);
    }

    @Test
    public void shouldReturnCommentData() {
        //given

        //when

        //then
        assertEquals(commentData, ugcComment.getCommentData());
    }

    @Test
    public void shouldReturnUserName() {
        //given

        //when

        //then
        assertEquals("Tester", ugcComment.getCommentData().getUser().getName());
    }

    @Test
    public void shouldReturnComments() {
        //given

        //when

        //then
        assertEquals(comments, ugcComment.getComments());
    }

    @Test
    public void shouldReturnCreationDate() throws Exception {
        //given

        //when
        commentData.setCreationDate(new JsonZonedDateTime(time).getJson());
        commentData.setLastModifiedDate(new JsonZonedDateTime(time).getJson());

        //then
        Comment commentData = ugcComment.getCommentData();
        String result = commentData.getCreationDate();
        assertEquals("{\"dayOfMonth\":31," +
                        "\"hour\":8," +
                        "\"minute\":42," +
                        "\"month\":\"\"," +
                        "\"monthValue\":12," +
                        "\"nano\":0," +
                        "\"second\":54," +
                        "\"year\":2019," +
                        "\"dayOfWeek\":\"\"," +
                        "\"dayOfYear\":365}",
                result);
        assertEquals(result, commentData.getLastModifiedDate());
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