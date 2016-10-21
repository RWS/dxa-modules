package com.sdl.dxa.modules.audience.model;

import org.junit.Test;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertFalse;
import static junit.framework.TestCase.assertTrue;

public class CurrentUserWidgetTest {

    @Test
    public void shouldGetIfCurrentUserIsLoggedIn() {
        //given
        TestingAuthenticationToken token = new TestingAuthenticationToken("1", "2");
        token.setAuthenticated(true);
        SecurityContextHolder.getContext().setAuthentication(token);

        //when
        boolean loggedIn = new CurrentUserWidget().isLoggedIn();

        //then
        assertTrue(loggedIn);
    }

    @Test
    public void shouldReturnCurrentUserName() {
        //given
        TestingAuthenticationToken token = new TestingAuthenticationToken("test", "2");
        token.setAuthenticated(true);
        token.setDetails(new UserProfile.Details("2", "test"));
        SecurityContextHolder.getContext().setAuthentication(token);

        //when
        String name = new CurrentUserWidget().getUserName();

        //then
        assertEquals("test", name);
    }

    @Test
    public void shouldReturnCurrentUserNameIfNotSpecificDetails() {
        //given
        TestingAuthenticationToken token = new TestingAuthenticationToken("test", "2");
        token.setAuthenticated(true);
        token.setDetails("test_simple");
        SecurityContextHolder.getContext().setAuthentication(token);

        //when
        String name = new CurrentUserWidget().getUserName();

        //then
        assertEquals("test_simple", name);
    }

    @Test
    public void shouldGetIfCurrentUserIsNull() {
        //when
        boolean loggedIn = new CurrentUserWidget().isLoggedIn();

        //then
        assertFalse(loggedIn);
    }

    @Test
    public void shouldGetIfCurrentUserIsForUserName() {
        //when
        String name = new CurrentUserWidget().getUserName();

        //then
        assertEquals("", name);
    }

    @Test
    public void shouldTreatAnonymousUserAsNotLoggedIn() {
        //given
        AnonymousAuthenticationToken token =
                new AnonymousAuthenticationToken("anonymousUser", "2", UserProfile.DEFAULT_AUTHORITIES);
        SecurityContextHolder.getContext().setAuthentication(token);

        //when
        String name = new CurrentUserWidget().getUserName();

        //then
        assertEquals("", name);
    }

    @Test
    public void shouldTreatAnonymousUserAsNotLoggedIn2() {
        //given
        AnonymousAuthenticationToken token =
                new AnonymousAuthenticationToken("1", "2", UserProfile.DEFAULT_AUTHORITIES);
        SecurityContextHolder.getContext().setAuthentication(token);

        //when
        String name = new CurrentUserWidget().getUserName();

        //then
        assertEquals("", name);
    }
}