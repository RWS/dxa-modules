package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AudienceManagerSecurityProvider {

    private final AudienceManagerService audienceManagerService;

    private final AuthenticationManager authenticationManager;

    @Autowired
    public AudienceManagerSecurityProvider(AudienceManagerService audienceManagerService,
                                           @Qualifier("authenticationManager") AuthenticationManager authenticationManager) {
        this.audienceManagerService = audienceManagerService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Validates the given pair of credentials and logs in if validation is successful.
     *
     * @param form login form to validate
     * @return whether there was a successful login
     */
    public boolean validate(@Nullable LoginForm form) {
        if (form == null) {
            log.debug("Passed null form, can't authenticate");
            return false;
        }

        Authentication requested = new UsernamePasswordAuthenticationToken(form.getUserName(), form.getPassword());

        try {
            audienceManagerService.prepareClaims(form);

            Authentication result = authenticationManager.authenticate(requested);

            SecurityContextHolder.getContext().setAuthentication(result);
            audienceManagerService.login(result.getDetails().toString());

            log.trace("Successfully authenticated. Security context contains: {}", SecurityContextHolder.getContext().getAuthentication());
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
