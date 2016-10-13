package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static com.sdl.dxa.modules.audience.model.UserProfile.DEFAULT_AUTHORITIES;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AudienceManagerAuthenticationProviderTest {

    @Mock
    private AudienceManagerUserService audienceManagerUserService;

    @Mock
    private UserProfile userProfile;

    @InjectMocks
    private AudienceManagerAuthenticationProvider provider;

    @Before
    public void init() {
        when(audienceManagerUserService.loadUserByUsername("userIdKey")).thenReturn(userProfile);
        when(audienceManagerUserService.loadUserByUsername("user_wrong_name")).thenReturn(userProfile);

        when(userProfile.getIdentifiers()).thenReturn(new ContactIdentifiers("userIdKey", "DXA"));
        when(userProfile.getUsername()).thenReturn("user");
        when(userProfile.getPassword()).thenReturn("password");
        when(userProfile.getId()).thenReturn("id");
        doCallRealMethod().when(userProfile).verifyPassword(anyString());
        doCallRealMethod().when(userProfile).getAuthorities();
    }

    @Test
    public void shouldSupportUsernamePasswordToken() {
        //when
        boolean isTrue = provider.supports(UsernamePasswordAuthenticationToken.class);
        boolean isFalse = provider.supports(Object.class);

        //then
        assertTrue(isTrue);
        assertFalse(isFalse);
    }

    @Test(expected = BadCredentialsException.class)
    public void shouldNotAuthenticateIfUserNotFound() {
        //given
        Authentication token = new UsernamePasswordAuthenticationToken("unknown", "password");

        //when
        provider.authenticate(token);
    }

    @Test(expected = BadCredentialsException.class)
    public void shouldNotAuthenticateIfUsernameIsDifferent() {
        //given 
        Authentication token = new UsernamePasswordAuthenticationToken("user_wrong_name", "password");

        //when
        provider.authenticate(token);
    }

    @Test(expected = BadCredentialsException.class)
    public void shouldNotAuthenticateWhenPasswordIsWrong() {
        //given
        Authentication token = new UsernamePasswordAuthenticationToken("userIdKey", "wrong password");

        //when
        provider.authenticate(token);

        //then
        verify(userProfile).verifyPassword(eq("wrong password"));
    }

    @Test
    public void shouldReturnAuthTokenWhenAuthenticationIsSuccessful() {
        //given
        Authentication token = new UsernamePasswordAuthenticationToken("userIdKey", "password");

        //when
        Authentication result = provider.authenticate(token);

        //then
        verify(userProfile).verifyPassword(eq("password"));
        assertEquals("user", result.getName());
        assertEquals("password", result.getCredentials());
        assertEquals("id", result.getDetails());
        assertEquals(DEFAULT_AUTHORITIES.iterator().next(), result.getAuthorities().iterator().next());
    }
}