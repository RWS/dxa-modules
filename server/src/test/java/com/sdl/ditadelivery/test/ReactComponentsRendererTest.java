package com.sdl.ditadelivery.test;

import com.sdl.ditadelivery.webapp.renderers.ReactComponentsRenderer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class ReactComponentsRendererTest {

    @Autowired
    private ReactComponentsRenderer reactComponentsRenderer;

    @Test
    public void renders() throws Exception {
        //given
        final String expected = "This control does not support server side rendering.";

        //when
        final String result = reactComponentsRenderer.renderPage("home");

        //then
        assertTrue(result.startsWith("<span"));
        assertTrue(result.contains(expected));
        assertTrue(result.endsWith("</span>"));
    }

    @Configuration
    @Profile("test")
    public static class TestConfig {
        @Bean
        public ReactComponentsRenderer reactComponentsRenderer() {
            return new ReactComponentsRenderer();
        }
    }
}
