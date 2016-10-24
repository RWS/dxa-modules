package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

public class AudienceManagerSecurityProviderTest {

    private AudienceManagerService audienceManagerService;

    private AuthenticationManager authenticationManager;

    private AudienceManagerSecurityProvider provider;

    private TestingAuthenticationToken token = new TestingAuthenticationToken("user", "password");

    @Before
    public void init() {
        audienceManagerService = mock(AudienceManagerService.class);
        authenticationManager = mock(AuthenticationManager.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        TokenBasedRememberMeServices rememberMeServices = spy(new TokenBasedRememberMeServices("key", userDetailsService));
        provider = new AudienceManagerSecurityProvider(audienceManagerService, authenticationManager, rememberMeServices);

        token.setDetails("id");

        doThrow(new BadCredentialsException("Test")).when(authenticationManager).authenticate(any(Authentication.class));
        doReturn(token).when(authenticationManager).authenticate(argThat(new BaseMatcher<Authentication>() {
            @Override
            public boolean matches(Object item) {
                return ((Authentication) item).getPrincipal().equals("user");
            }

            @Override
            public void describeTo(Description description) {
                description.appendText("Username is user");
            }
        }));
    }


    @Test
    public void shouldLogoutAlsoInAudienceManagerAndRememberMe() {
        //when
        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("test", "test"));

        //when
        provider.logout(new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        verify(audienceManagerService).logout();
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void shouldAlsoAuthenticateInAudienceManagerAndRememberMe() {
        //given
        LoginForm loginForm = new LoginForm();
        loginForm.setUserName("user");
        loginForm.setPassword("password");

        //when
        boolean isTrue = provider.validate(loginForm, new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertTrue(isTrue);
        assertEquals(token, SecurityContextHolder.getContext().getAuthentication());
        verify(audienceManagerService).login(eq("user"));
    }

    @Test
    public void shouldNotAuthenticateIfLoginFormIsNull() {
        //when
        boolean isFalse = provider.validate(null, new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertFalse(isFalse);
    }

    @Test
    public void shouldReturnFalseValidationWhenCredentialsAreWrong() {
        //given
        LoginForm loginForm = new LoginForm();
        loginForm.setUserName("wrong");
        loginForm.setPassword("wrong");

        //when
        boolean isFalse = provider.validate(loginForm, new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertFalse(isFalse);
        verify(authenticationManager).authenticate(any(Authentication.class));
    }


}