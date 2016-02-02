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
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = ContextualMediaHelperTest.ContextualMediaHelperTestConfig.class)
public class ContextualMediaHelperTest {

    @Autowired
    private MediaHelper mediaHelper;

    @Test
    public void testGetResponsiveImageUrl() throws Exception {
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 3.3, 12), is("testCid/cid/scale/2048x621/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 3.3, 6), is("testCid/cid/scale/1024x311/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 2.0, 12), is("testCid/cid/scale/2048x1024/test/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "50%", 3.3, 12), is("testCid/cid/scale/1024x311/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "50%", 3.3, 6), is("testCid/cid/scale/640x194/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "75%", 2.0, 12), is("testCid/cid/scale/2048x1024/test/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "320", 2.5, 12), is("testCid/cid/scale/320x128/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "321", 2.5, 12), is("testCid/cid/scale/640x256/test/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "639", 2.5, 12), is("testCid/cid/scale/640x256/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "640", 2.5, 12), is("testCid/cid/scale/640x256/test/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "641", 2.5, 12), is("testCid/cid/scale/1024x410/test/example.jpg"));
    }

    /**
     * Spring configuration for {@code ContextualMediaHelperTest}.
     */
    @Configuration
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
        public MediaHelper.ResponsiveMediaUrlBuilder.HostsNamesProvider hostsNamesProvider() {
            return new MockHostsNamesProvider();
        }

        @Bean
        public WebRequestContext webRequestContext() {
            return new MockRequestContextImpl();
        }

        @Bean
        public HttpServletRequest servletRequest() {
            return new MockHttpServletRequest();
        }

        private static class MockRequestContextImpl extends WebRequestContextImpl {
            @Override
            public int getDisplayWidth() {
                return 1920;
            }

            @Override
            public double getPixelRatio() {
                return 1.0;
            }

            @Override
            public int getMaxMediaWidth() {
                return 2048;
            }
        }

        private static class MockHostsNamesProvider implements MediaHelper.ResponsiveMediaUrlBuilder.HostsNamesProvider {
            @Override
            public String getHostname() {
                return "test";
            }

            @Override
            public String getCidHostname() {
                return "testCid/cid";
            }
        }
    }
}
