package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.UserProfile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AudienceManagerAuthenticationProvider implements AuthenticationProvider {

    private final AudienceManagerUserService audienceManagerUserService;

    @Autowired
    public AudienceManagerAuthenticationProvider(AudienceManagerUserService audienceManagerUserService) {
        this.audienceManagerUserService = audienceManagerUserService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();

        UserProfile user = audienceManagerUserService.loadUserByUsername(username);

        if (user == null || !user.getIdentifiers().getIdentificationKey().equals(username)) {
            log.debug("User '{}' is not found in AM", username);
            throw new BadCredentialsException("No user found in Audience manager with username " + username);
        }

        if (!user.verifyPassword(password)) {
            log.trace("User '{}' found in AM but password is wrong", username);
            throw new BadCredentialsException("Wrong password for username " + username);
        }

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                user.getUsername(), user.getPassword(), user.getAuthorities());
        token.setDetails(user.getId());

        log.trace("Successful authentication for user '{}' and id '{}'", username, user.getId());
        return token;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

}
