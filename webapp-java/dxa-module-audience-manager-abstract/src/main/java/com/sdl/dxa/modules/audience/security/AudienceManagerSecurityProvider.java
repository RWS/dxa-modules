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
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Service
public class AudienceManagerSecurityProvider {

    private final AudienceManagerService audienceManagerService;

    private final AuthenticationManager authenticationManager;

    private final AbstractRememberMeServices rememberMeServices;

    @Autowired
    public AudienceManagerSecurityProvider(AudienceManagerService audienceManagerService,
                                           @Qualifier("authenticationManager") AuthenticationManager authenticationManager,
                                           AbstractRememberMeServices rememberMeServices) {
        this.audienceManagerService = audienceManagerService;
        this.authenticationManager = authenticationManager;
        this.rememberMeServices = rememberMeServices;
    }

    /**
     * Validates the given pair of credentials and logs in if validation is successful.
     *
     * @param form login form to validate
     * @return whether there was a successful login
     */
    public boolean validate(@Nullable LoginForm form, HttpServletRequest request, HttpServletResponse response) {
        if (form == null) {
            log.debug("Passed null form, can't authenticate");
            return false;
        }

        Authentication requested = new UsernamePasswordAuthenticationToken(form.getUserName(), form.getPassword());

        try {
            Authentication result = authenticationManager.authenticate(requested);

            SecurityContextHolder.getContext().setAuthentication(result);
            audienceManagerService.login(result.getDetails().toString());
            rememberMeServices.loginSuccess(request, response, result);

            log.trace("Successfully authenticated. Security context contains: {}", SecurityContextHolder.getContext().getAuthentication());
            return true;
        } catch (AuthenticationException e) {
            log.debug("Authentication failed with {}", requested, e);
            rememberMeServices.loginFail(request, response);
            return false;
        }
    }

    /**
     * Logs current user out.
     */
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        rememberMeServices.logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        SecurityContextHolder.getContext().setAuthentication(null);
        audienceManagerService.logout();
    }
}
