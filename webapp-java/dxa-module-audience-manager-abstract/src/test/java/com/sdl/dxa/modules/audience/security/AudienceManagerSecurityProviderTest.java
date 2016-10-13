package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class AudienceManagerSecurityProviderTest {

    @Mock
    private AudienceManagerService audienceManagerService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AudienceManagerSecurityProvider provider;

    private TestingAuthenticationToken token = new TestingAuthenticationToken("user", "password");

    @Before
    public void init() {
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
    public void shouldLogoutAlsoInAudienceManager() {
        //when
        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("test", "test"));

        //when
        provider.logout();

        //then
        verify(audienceManagerService).logout();
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void shouldAlsoAuthenticateInAudienceManager() {
        //given
        LoginForm loginForm = new LoginForm();
        loginForm.setUserName("user");
        loginForm.setPassword("password");

        //when
        boolean isTrue = provider.validate(loginForm);

        //then
        assertTrue(isTrue);
        verify(audienceManagerService).prepareClaims(eq(loginForm));
        assertEquals(token, SecurityContextHolder.getContext().getAuthentication());
        verify(audienceManagerService).login(eq("id"));
    }

    @Test
    public void shouldNotAuthenticateIfLoginFormIsNull() {
        //when
        boolean isFalse = provider.validate(null);

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
        boolean isFalse = provider.validate(loginForm);

        //then
        assertFalse(isFalse);
        verify(authenticationManager).authenticate(any(Authentication.class));
    }


}