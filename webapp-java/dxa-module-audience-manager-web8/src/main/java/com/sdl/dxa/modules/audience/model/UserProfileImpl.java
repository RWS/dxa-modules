package com.sdl.dxa.modules.audience.model;

import com.tridion.marketingsolution.profile.Contact;
import com.tridion.marketingsolution.utilities.Digests;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.crypto.password.PasswordEncoder;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserProfileImpl extends UserProfile {

    private transient Contact contact;

    public UserProfileImpl(Contact contact, String usernameKey, String passwordKey, ContactIdentifiers contactIdentifiers) {
        super(usernameKey, passwordKey, contactIdentifiers);
        this.contact = contact;
    }

    @Override
    public String getPassword() {
        return contact.getExtendedDetail(getPasswordKey());
    }

    @Override
    public String getUsername() {
        return contact.getExtendedDetail(getUsernameKey());
    }

    @NotNull
    @Override
    protected PasswordEncoder getPasswordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return Digests.digestPassword(rawPassword.toString());
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return Digests.checkPassword(rawPassword.toString(), encodedPassword);
            }
        };
    }

    @Override
    public String getId() {
        return contact.getId().toString();
    }
}
