package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import org.dd4t.core.caching.CacheElement;
import org.dd4t.core.caching.impl.CacheElementImpl;
import org.dd4t.providers.PayloadCacheProvider;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.jetbrains.annotations.NotNull;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
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

    private static final String CONFIG_PASSWORD_FIELD = "configPasswordField";

    private static final String CONFIG_USERNAME_FIELD = "configUsernameField";

    private static final String CONFIG_CONTACT_IMPORT_SOURCES = "configContactImportSources";

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private AudienceManagerService audienceManagerService;

    @Mock
    private Localization localization;

    @Mock
    private PayloadCacheProvider payloadCacheProvider;

    @InjectMocks
    private AudienceManagerUserService service;

    @Before
    public void init() {
        ReflectionTestUtils.setField(service, CONFIG_CONTACT_IMPORT_SOURCES, CONFIG_CONTACT_IMPORT_SOURCES);
        ReflectionTestUtils.setField(service, CONFIG_USERNAME_FIELD, CONFIG_USERNAME_FIELD);
        ReflectionTestUtils.setField(service, CONFIG_PASSWORD_FIELD, CONFIG_PASSWORD_FIELD);

        when(webRequestContext.getLocalization()).thenReturn(localization);
        CacheElement<UserProfile> cacheElement = new CacheElementImpl<>(null, true);
        when(payloadCacheProvider.<UserProfile>loadPayloadFromLocalCache(anyString())).thenReturn(cacheElement);
    }

    @Test(expected = UsernameNotFoundException.class)
    public void shouldThrowExceptionIfUserNameIsNull() {
        //given

        //when
        service.loadUserByUsername(null);

        //then
        //exception
    }

    @Test(expected = UsernameNotFoundException.class)
    public void shouldThrowExceptionIfUserNameIsEmpty() {
        //given

        //when
        service.loadUserByUsername("");

        //then
        //exception
    }

    @Test(expected = UsernameNotFoundException.class)
    public void shouldThrowExceptionInCaseNoUserFound1() {
        //given
        when(audienceManagerService.findContact(any(ContactIdentifiers.class), anyString(), anyString())).thenReturn(null);

        //when
        service.loadUserByUsername("username");

        //then
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", null, 1)), anyString(), anyString());
    }

    @Test(expected = UsernameNotFoundException.class)
    public void shouldThrowExceptionInCaseNoUserFound2() {
        //given
        when(audienceManagerService.findContact(any(ContactIdentifiers.class), anyString(), anyString())).thenReturn(null);

        //when
        service.loadUserByUsername("");

        //then
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", null, 1)), anyString(), anyString());
    }

    @Test(expected = UsernameNotFoundException.class)
    public void shouldThrowExceptionInCaseNoUserFound3() {
        //given
        when(audienceManagerService.findContact(any(ContactIdentifiers.class), anyString(), anyString())).thenReturn(null);

        //when
        service.loadUserByUsername(null);

        //then
        verify(audienceManagerService).findContact(argThat(getContactIdentifiersMatcher("username", null, 1)), anyString(), anyString());
    }

    @Test
    public void shouldReturnUserIfFound() {
        //given
        when(localization.getConfiguration(eq(CONFIG_CONTACT_IMPORT_SOURCES))).thenReturn("other, DXA, other2");
        when(localization.getConfiguration(eq(CONFIG_USERNAME_FIELD))).thenReturn("userKey");
        when(localization.getConfiguration(eq(CONFIG_PASSWORD_FIELD))).thenReturn("passwordKey");

        UserProfile profile = mock(UserProfile.class);
        when(profile.getId()).thenReturn("my id");
        when(audienceManagerService.findContact(argThat(getContactIdentifiersMatcher("username", "DXA", 2)), eq("userKey"), eq("passwordKey")))
                .thenReturn(profile);

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