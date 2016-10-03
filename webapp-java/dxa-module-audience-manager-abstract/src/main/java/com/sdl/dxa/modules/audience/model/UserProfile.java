package com.sdl.dxa.modules.audience.model;

import com.google.common.collect.Sets;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;

import static java.util.Collections.unmodifiableSet;

@Data
@RequiredArgsConstructor
public abstract class UserProfile implements UserDetails {

    public static final Collection<? extends GrantedAuthority> DEFAULT_AUTHORITIES = unmodifiableSet(
            Sets.<GrantedAuthority>newHashSet(new SimpleGrantedAuthority("USER")));

    private static final String ENCRYPTED_TOKEN = "encrypted:";

    private final String usernameKey;

    private final String passwordKey;

    private String email;

    @NotNull
    protected abstract PasswordEncoder getPasswordEncoder();

    public abstract String getId();

    public boolean verifyPassword(@Nullable String password) {
        if (password == null) {
            return false;
        }

        String storedPassword = getPassword();
        return storedPassword.startsWith(ENCRYPTED_TOKEN) ?
                getPasswordEncoder().matches(password, storedPassword.substring(ENCRYPTED_TOKEN.length())) :
                password.equals(storedPassword);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return DEFAULT_AUTHORITIES;
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
