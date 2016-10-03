package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.jetbrains.annotations.NotNull;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static com.sdl.dxa.modules.audience.model.UserProfile.DEFAULT_AUTHORITIES;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SecurityProviderTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private AudienceManagerService audienceManagerService;

    @Mock
    private Localization localization;

    @InjectMocks
    @Spy
    private SecurityProvider provider;

    @Before
    public void init() {
        when(webRequestContext.getLocalization()).thenReturn(localization);
    }


    @Test
    public void shouldReturnNullIfUserNameIsEmptyOrNull() {
        //given 

        //when
        UserProfile isNull = provider.loadUserByUsername(null);
        UserProfile isEmpty = provider.loadUserByUsername("");

        //then
        assertNull(isEmpty);
        assertNull(isNull);
    }

    @Test
    public void shouldReturnNullInCaseNoUserFound() {
        //given
        when(audienceManagerService.findContact(any(ContactIdentifiers.class), anyString(), anyString())).thenReturn(null);

        //when
        UserProfile isNull = provider.loadUserByUsername("username");

        //then
        assertNull(isNull);
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", null, 1)), anyString(), anyString());
    }

    @Test
    public void shouldReturnUserIfFound() {
        //given
        when(localization.getConfiguration(eq("audiencemanager.contactImportSources"))).thenReturn("other, DXA, other2");
        when(localization.getConfiguration(eq("audiencemanager.userNameField"))).thenReturn("userKey");
        when(localization.getConfiguration(eq("audiencemanager.passwordField"))).thenReturn("passwordKey");

        UserProfile profile = mock(UserProfile.class);
        when(profile.getId()).thenReturn("my id");
        when(audienceManagerService.findContact(argThat(getContactIdentifiersMatcher("username", "DXA", 2)), eq("userKey"), eq("passwordKey"))).thenReturn(profile);

        //when
        UserProfile user = provider.loadUserByUsername("username");

        //then
        assertNotNull(user);
        assertEquals("my id", user.getId());
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", "other", 2)), eq("userKey"), eq("passwordKey"));
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", "DXA", 2)), eq("userKey"), eq("passwordKey"));
        verify(audienceManagerService, never()).findContact(argThat(getContactIdentifiersMatcher("username", "other2", 2)), eq("userKey"), eq("passwordKey"));
    }

    @Test(expected = BadCredentialsException.class)
    public void shouldNotAuthenticateIfUserNotFound() {
        //given 
        Authentication token = new UsernamePasswordAuthenticationToken("user", "password");

        //when
        provider.authenticate(token);
    }

    @Test(expected = BadCredentialsException.class)
    public void shouldNotAuthenticateWhenPasswordIsWrong() {
        //given
        Authentication token = new UsernamePasswordAuthenticationToken("user", "wrong password");
        UserProfile user = mock(UserProfile.class);
        doReturn(false).when(user).verifyPassword(anyString());
        doReturn(user).when(provider).loadUserByUsername("user");

        //when
        provider.authenticate(token);

        //then
        verify(user).verifyPassword(eq("wrong password"));
    }

    @Test
    public void shouldReturnAuthTokenWhenAuthenticationIsSuccessful() {
        //given 
        Authentication token = new UsernamePasswordAuthenticationToken("user", "password");
        UserProfile user = mock(UserProfile.class);
        doReturn(true).when(user).verifyPassword(anyString());
        doReturn("id").when(user).getId();
        doReturn(user).when(provider).loadUserByUsername("user");

        //when
        Authentication result = provider.authenticate(token);

        //then
        verify(user).verifyPassword(eq("password"));
        assertEquals("user", result.getName());
        assertEquals("password", result.getCredentials());
        assertEquals("id", result.getDetails());
        assertEquals(DEFAULT_AUTHORITIES.iterator().next(), result.getAuthorities().iterator().next());
    }

    @Test
    public void shouldReturnFalseValidationWhenCredentialsAreWrong() {
        //given
        doThrow(BadCredentialsException.class).when(provider).authenticate(any(Authentication.class));

        //when
        boolean isFalse = provider.validate("", "");

        //then
        assertFalse(isFalse);
        verify(provider).authenticate(any(Authentication.class));
    }

    @Test
    public void shouldAlsoAuthenticateInAudienceManager() {
        //given
        UsernamePasswordAuthenticationToken toBeReturned = new UsernamePasswordAuthenticationToken("user", "pass");
        toBeReturned.setDetails("id");
        UsernamePasswordAuthenticationToken callToken = new UsernamePasswordAuthenticationToken("user", "pass");
        doReturn(toBeReturned).when(provider).authenticate(eq(callToken));

        //when
        boolean isTrue = provider.validate("user", "pass");

        //then
        assertTrue(isTrue);
        verify(provider).authenticate(eq(callToken));
        verify(audienceManagerService).login(eq("id"));
    }

    @Test
    public void shouldLogoutAlsoInAudienceManager() {
        //when
        provider.logout();

        //then
        verify(audienceManagerService).logout();
    }

    @NotNull
    private BaseMatcher<ContactIdentifiers> getContactIdentifiersMatcher(final String username, final String importSource, final int length) {
        return new BaseMatcher<ContactIdentifiers>() {
            @Override
            public boolean matches(Object item) {
                String[] ids = ((ContactIdentifiers) item).getIdentifiers();
                return ids[0].equals(username) && (importSource == null || ids[1].equals(importSource)) && ids.length == length;
            }

            @Override
            public void describeTo(Description description) {
                description.appendText("Contains given username, import source DXA and nothing more");
            }
        };
    }
}