package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
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
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AudienceManagerUserServiceTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private AudienceManagerService audienceManagerService;

    @Mock
    private Localization localization;

    @InjectMocks
    private AudienceManagerUserService service;

    @Before
    public void init() {
        when(webRequestContext.getLocalization()).thenReturn(localization);
    }

    @Test
    public void shouldReturnNullIfUserNameIsEmptyOrNull() {
        //given

        //when
        UserProfile isNull = service.loadUserByUsername(null);
        UserProfile isEmpty = service.loadUserByUsername("");

        //then
        assertNull(isEmpty);
        assertNull(isNull);
    }

    @Test
    public void shouldReturnNullInCaseNoUserFound() {
        //given
        when(audienceManagerService.findContact(any(ContactIdentifiers.class), anyString(), anyString())).thenReturn(null);

        //when
        UserProfile isNull = service.loadUserByUsername("username");
        UserProfile isNull2 = service.loadUserByUsername("");
        UserProfile isNull3 = service.loadUserByUsername(null);

        //then
        assertNull(isNull);
        assertNull(isNull2);
        assertNull(isNull3);
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
        UserProfile user = service.loadUserByUsername("username");

        //then
        assertNotNull(user);
        assertEquals("my id", user.getId());
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", "other", 2)), eq("userKey"), eq("passwordKey"));
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", "DXA", 2)), eq("userKey"), eq("passwordKey"));
        verify(audienceManagerService, never()).findContact(argThat(getContactIdentifiersMatcher("username", "other2", 2)), eq("userKey"), eq("passwordKey"));
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