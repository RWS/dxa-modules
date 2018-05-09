package com.sdl.dxa.modules.ugc.model.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.util.CMURI;
import com.tridion.util.TCMURI;
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
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class UgcCommentsTest {

    private static UgcComments ugcComments = new UgcComments();
    private static UgcComment ugcComment = new UgcComment();
    private static List<UgcComment> comments = new ArrayList<>();
    private static CMURI target;

    static {
    }

    @Test
    public void shouldReturnComments() {
        //given
        comments.add(ugcComment);
        ugcComments.setComments(comments);
        //when

        //then
        assertEquals(ugcComment, ugcComments.getComments().get(0));
    }

    @Test
    public void setTarget() throws Exception {
        //given
        target = new TCMURI(TcmUtils.buildTcmUri(1, 2, TcmUtils.COMPONENT_ITEM_TYPE));
        ugcComments.setTarget(target);
        //when

        //then
        assertEquals(target, ugcComments.getTarget());
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