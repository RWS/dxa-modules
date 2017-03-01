package com.sdl.dxa.modules.audience.model;

import com.google.common.collect.Sets;
import com.tridion.marketingsolution.profile.Contact;
import com.tridion.marketingsolution.utilities.Digests;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;

import static java.util.Collections.unmodifiableSet;

@Data
@RequiredArgsConstructor
public class UserProfile implements UserDetails, CredentialsContainer {

    public static final Collection<? extends GrantedAuthority> DEFAULT_AUTHORITIES = unmodifiableSet(
            Sets.<GrantedAuthority>newHashSet(new SimpleGrantedAuthority("ROLE_USER")));

    private static final String ENCRYPTED_TOKEN = "encrypted:";

    private final transient Contact contact;

    private final String username;

    private final String displayUsernameKey;

    private final String passwordKey;

    private final transient ContactIdentifiers identifiers;

    public String getDisplayUsername() {
        return contact.getExtendedDetail(getDisplayUsernameKey());
    }

    public String getId() {
        return contact.getId().toString();
    }

    @Override
    public void eraseCredentials() {
        contact.setExtendedDetail(getPasswordKey(), null);
    }

    public boolean verifyPassword(@Nullable String password) {
        if (password == null) {
            return false;
        }

        String storedPassword = getPassword();
        return storedPassword.startsWith(ENCRYPTED_TOKEN) ?
                getPasswordEncoder().matches(password, storedPassword.substring(ENCRYPTED_TOKEN.length())) :
                password.equals(storedPassword);
    }

    @NotNull
    PasswordEncoder getPasswordEncoder() {
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
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return DEFAULT_AUTHORITIES;
    }

    @Override
    public String getPassword() {
        return contact.getExtendedDetail(getPasswordKey());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
