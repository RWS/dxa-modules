package com.sdl.dxa.modules.ugc.model.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.data.User;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import com.sdl.webapp.common.util.TcmUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Spy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.time.ZonedDateTime;
import java.util.ArrayList;
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
    private static ZonedDateTime time = ZonedDateTime.now();
    private static User user = new User();
    @Spy
    private static UgcService ugcService;

    static {

        user.setEmailAddress("test@test.test");
        user.setName("Tester");
        user.setExternalId("ExternalId");
        user.setId("Id");

        commentData.setCreationDate(time);
        commentData.setCreationDateTime(ugcService.convert(time));
        commentData.setLastModifiedDate(time);
        commentData.setLastModifiedDateTime(ugcService.convert(time));
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
    public void shouldReturnCreationDate() {
        //given

        //when

        //then
        assertEquals(time, ugcComment.getCommentData().getCreationDate());
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