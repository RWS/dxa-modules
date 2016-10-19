package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import com.sdl.webapp.common.api.WebRequestContext;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class AudienceManagerClaimFilterTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private AudienceManagerService audienceManagerService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private AudienceManagerClaimFilter audienceManagerClaimFilter;

    @Before
    public void init() {
        ReflectionTestUtils.setField(audienceManagerClaimFilter, "ignoreRegexp", "^ignore.*");
    }

    @After
    public void after() throws IOException, ServletException {
        verify(filterChain).doFilter(any(ServletRequest.class), any(ServletResponse.class));
    }

    @Test
    public void shouldIgnorePathIfNatches() throws IOException, ServletException {
        //given 
        doReturn("ignore/path").when(webRequestContext).getRequestPath();

        //when
        audienceManagerClaimFilter.doFilter(new MockHttpServletRequest(), new MockHttpServletResponse(), filterChain);

        //then
        verify(audienceManagerService, never()).prepareClaims(anyString());
    }

    @Test
    public void shouldPrepareClaimsIfUrlDoesntMatch() throws IOException, ServletException {
        //given
        String expected = "simple/path";
        doReturn(expected).when(webRequestContext).getRequestPath();

        //when
        audienceManagerClaimFilter.doFilter(new MockHttpServletRequest(), new MockHttpServletResponse(), filterChain);

        //then
        verify(audienceManagerService).prepareClaims(eq(expected));
    }
}