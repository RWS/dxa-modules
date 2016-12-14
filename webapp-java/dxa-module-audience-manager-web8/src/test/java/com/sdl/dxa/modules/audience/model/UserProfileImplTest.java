package com.sdl.dxa.modules.audience.model;

import com.tridion.marketingsolution.profile.Contact;
import com.tridion.marketingsolution.utilities.TcmUri;
import org.junit.Test;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.sql.SQLException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.eq;
import static org.mockito.Matchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("Duplicates")
public class UserProfileImplTest {

    @Test
    public void shouldGetIdAndUsernameAndPasswordFromContact() throws IOException, SQLException {
        //given 
        Contact contact = mock(Contact.class);
        when(contact.getExtendedDetail("uKey")).thenReturn("user");
        when(contact.getExtendedDetail("pKey")).thenReturn("pass");
        TcmUri tcmUri = mock(TcmUri.class);
        when(tcmUri.toString()).thenReturn("id");
        when(contact.getId()).thenReturn(tcmUri);

        //when
        UserProfile profile = new UserProfileImpl(contact, "user", "uKey", "pKey", new ContactIdentifiers("uKey", "DXA"));

        //then
        assertEquals("user", profile.getUsername());
        assertEquals("pass", profile.getPassword());
        assertEquals("id", profile.getId());
    }

    @Test
    public void shouldReturnNonNullPasswordEncoder() {
        //when
        PasswordEncoder encoder = new UserProfileImpl(null, null, null, null, null).getPasswordEncoder();

        //then
        assertNotNull(encoder);
    }

    @Test
    public void shouldEraseCredentials() {
        //given 
        Contact contact = mock(Contact.class);

        //when
        UserProfileImpl userProfile = new UserProfileImpl(contact, null, null, "pKey", null);
        userProfile.eraseCredentials();

        //then
        verify(contact).setExtendedDetail(eq("pKey"), isNull(String.class));
        assertTrue(userProfile instanceof CredentialsContainer);
    }
}