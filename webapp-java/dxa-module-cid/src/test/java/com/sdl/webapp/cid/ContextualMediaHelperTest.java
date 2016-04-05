package com.sdl.webapp.cid;

import com.sdl.webapp.common.api.MediaHelper;
import com.sdl.webapp.common.impl.DefaultMediaHelper;
import com.sdl.webapp.common.impl.WebRequestContextImpl;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;

import javax.servlet.ServletContext;
import java.net.UnknownHostException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ContextualMediaHelperTest {

    private static final String LOCAL_NAME = "localhost";
    private static final int SERVER_PORT = 8080;
    private static MediaHelper mediaHelper = new DefaultMediaHelper();

    @BeforeClass
    public static void before() {
        WebRequestContextImpl requestContext = mock(WebRequestContextImpl.class);
        when(requestContext.getDisplayWidth()).thenReturn(1920);
        when(requestContext.getPixelRatio()).thenReturn(1.0);
        when(requestContext.getMaxMediaWidth()).thenReturn(2048);

        MockHttpServletRequest servletRequest = new MockHttpServletRequest(mock(ServletContext.class));
        servletRequest.setServerPort(SERVER_PORT);
        servletRequest.setLocalName(LOCAL_NAME);

        CidResponsiveMediaUrlBuilder cidResponsiveMediaUrlBuilder = new CidResponsiveMediaUrlBuilder();
        ReflectionTestUtils.setField(cidResponsiveMediaUrlBuilder, "mapping", "/cid/*");
        ReflectionTestUtils.setField(cidResponsiveMediaUrlBuilder, "servletRequest", servletRequest);
        ReflectionTestUtils.invokeMethod(cidResponsiveMediaUrlBuilder, "init");

        ReflectionTestUtils.setField(mediaHelper, "webRequestContext", requestContext);
        ReflectionTestUtils.setField(mediaHelper, "responsiveMediaUrlBuilder", cidResponsiveMediaUrlBuilder);
    }

    private static String getHostname() throws UnknownHostException {
        return LOCAL_NAME + ':' + SERVER_PORT;
    }

    @Test
    public void testGetResponsiveImageUrl() throws Exception {
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 3.3, 12), is("/cid/scale/2048x621/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 3.3, 6), is("/cid/scale/1024x311/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "100%", 2.0, 12), is("/cid/scale/2048x1024/" + getHostname() + "/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "50%", 3.3, 12), is("/cid/scale/1024x311/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "50%", 3.3, 6), is("/cid/scale/640x194/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "75%", 2.0, 12), is("/cid/scale/2048x1024/" + getHostname() + "/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "320", 2.5, 12), is("/cid/scale/320x128/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "321", 2.5, 12), is("/cid/scale/640x256/" + getHostname() + "/example.jpg"));

        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "639", 2.5, 12), is("/cid/scale/640x256/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "640", 2.5, 12), is("/cid/scale/640x256/" + getHostname() + "/example.jpg"));
        assertThat(mediaHelper.getResponsiveImageUrl("/example.jpg", "641", 2.5, 12), is("/cid/scale/1024x410/" + getHostname() + "/example.jpg"));
    }
}
