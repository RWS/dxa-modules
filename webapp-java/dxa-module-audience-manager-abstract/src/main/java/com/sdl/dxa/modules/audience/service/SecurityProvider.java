package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

import static com.google.common.base.Strings.nullToEmpty;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
@Slf4j
public class SecurityProvider implements UserDetailsService, AuthenticationManager {

    private final WebRequestContext webRequestContext;

    private final AudienceManagerService audienceManagerService;

    private final HttpServletRequest httpServletRequest;

    @Autowired
    public SecurityProvider(WebRequestContext webRequestContext, HttpServletRequest httpServletRequest, AudienceManagerService audienceManagerService) {
        this.webRequestContext = webRequestContext;
        this.httpServletRequest = httpServletRequest;
        this.audienceManagerService = audienceManagerService;
    }

    @Override
    @Nullable
    public UserProfile loadUserByUsername(String username) {
        if (isEmpty(username)) {
            log.debug("Passed an empty username");
            return null;
        }

        Localization localization = webRequestContext.getLocalization();

        String importSources = localization.getConfiguration("audiencemanager.contactImportSources");
        for (String source : nullToEmpty(importSources).split(",")) {
            UserProfile user = audienceManagerService.findContact(new ContactIdentifiers(username, source.trim()),
                    localization.getConfiguration("audiencemanager.userNameField"),
                    localization.getConfiguration("audiencemanager.passwordField"));

            if (user != null) {
                log.debug("Audience Manager identification key '{}' resolved to UserProfile '{}'", username, user);
                return user;
            }
        }

        log.debug("No Audience Manager Contact found for identification key '{}' and Import Sources '{}'", username, importSources);
        return null;
    }

    @Override
    public Authentication authenticate(Authentication authentication) {
        UserProfile user = loadUserByUsername(authentication.getName());

        if (user == null || !user.verifyPassword(authentication.getCredentials().toString())) {
            throw new BadCredentialsException("No user found in Audience manager with username " + authentication.getName());
        }
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                authentication.getName(), authentication.getCredentials(), UserProfile.DEFAULT_AUTHORITIES);
        token.setDetails(user.getId());
        return token;
    }

    /**
     * Validates the given pair of credentials and logs in if validation is successful.
     *
     * @param userName username to validate
     * @param password password to validate
     * @return whether there was a successful login
     */
    public boolean validate(String userName, String password) {
        Authentication requested = new UsernamePasswordAuthenticationToken(userName, password);

        try {
            Authentication result = authenticate(requested);

            SecurityContextHolder.getContext().setAuthentication(result);
            audienceManagerService.login(result.getDetails().toString());

            log.debug("Successfully authenticated. Security context contains: {}", SecurityContextHolder.getContext().getAuthentication());
            return true;
        } catch (AuthenticationException e) {
            log.debug("Authentication failed with {}", requested, e);
            return false;
        }
    }

    /**
     * Logs current user out.
     */
    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
        audienceManagerService.logout();
    }
}
