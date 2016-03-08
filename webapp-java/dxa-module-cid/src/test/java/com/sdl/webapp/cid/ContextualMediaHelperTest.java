package com.sdl.webapp.cid;

import com.sdl.webapp.common.api.MediaHelper;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.impl.DefaultMediaHelper;
import com.sdl.webapp.common.impl.WebRequestContextImpl;
import com.sdl.webapp.common.impl.contextengine.ContextEngineImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = ContextualMediaHelperTest.ContextualMediaHelperTestConfig.class)
@ActiveProfiles("test")
public class ContextualMediaHelperTest {

    @Autowired
    private MediaHelper mediaHelper;

    @Autowired
    private HttpServletRequest servletRequest;

    @Test
    public void testGetResponsiveImageUrl() throws Exception {
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 3.3, 12), is("testCid/cid/scale/2048x621/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 3.3, 6), is("testCid/cid/scale/1024x311/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 2.0, 12), is("testCid/cid/scale/2048x1024/" + getHostname() + "/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "50%", 3.3, 12), is("testCid/cid/scale/1024x311/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "50%", 3.3, 6), is("testCid/cid/scale/640x194/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "75%", 2.0, 12), is("testCid/cid/scale/2048x1024/" + getHostname() + "/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "320", 2.5, 12), is("testCid/cid/scale/320x128/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "321", 2.5, 12), is("testCid/cid/scale/640x256/" + getHostname() + "/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "639", 2.5, 12), is("testCid/cid/scale/640x256/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "640", 2.5, 12), is("testCid/cid/scale/640x256/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "641", 2.5, 12), is("testCid/cid/scale/1024x410/" + getHostname() + "/example.jpg"));
    }


    private String getHostname() throws UnknownHostException {
        return InetAddress.getLocalHost().getCanonicalHostName() + ':' + servletRequest.getServerPort();
    }

    /**
     * Spring configuration for {@code ContextualMediaHelperTest}.
     */
    @Configuration
    @Profile("test")
    public static class ContextualMediaHelperTestConfig {

        @Bean
        public ContextEngineImpl contextEngine() {
            return mock(ContextEngineImpl.class);
        }

        @Bean
        public ContextClaimsProvider contextClaimsProvider() {
            return mock(ContextClaimsProvider.class);
        }

        @Bean
        public MediaHelper mediaHelper() {
            return new DefaultMediaHelper();
        }

        @Bean
        public MediaHelper.ResponsiveMediaUrlBuilder responsiveMediaUrlBuilder() {
            return new CidResponsiveMediaUrlBuilder();
        }

        @Bean
        public WebRequestContext webRequestContext() {
            WebRequestContextImpl requestContext = mock(WebRequestContextImpl.class);
            when(requestContext.getDisplayWidth()).thenReturn(1920);
            when(requestContext.getPixelRatio()).thenReturn(1.0);
            when(requestContext.getMaxMediaWidth()).thenReturn(2048);
            return requestContext;
        }

        @Bean
        public HttpServletRequest servletRequest() {
            ServletContext servletContext = mock(ServletContext.class);
            when(servletContext.getInitParameter(eq("cidUrl"))).thenReturn("testCid/cid");

            return new MockHttpServletRequest(servletContext);
        }
    }
}
