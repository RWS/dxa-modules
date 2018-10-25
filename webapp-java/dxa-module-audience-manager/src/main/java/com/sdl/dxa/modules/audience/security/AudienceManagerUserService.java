package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static com.google.common.base.Strings.nullToEmpty;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Slf4j
@Service
public class AudienceManagerUserService implements UserDetailsService {

    private final WebRequestContext webRequestContext;

    private final AudienceManagerService audienceManagerService;

    @Value("${dxa.modules.am.configuration.contactImportSources}")
    private String configContactImportSources;

    @Value("${dxa.modules.am.configuration.userNameField}")
    private String configUsernameField;

    @Value("${dxa.modules.am.configuration.passwordField}")
    private String configPasswordField;

    @Autowired
    public AudienceManagerUserService(AudienceManagerService audienceManagerService,
                                      WebRequestContext webRequestContext) {
        this.audienceManagerService = audienceManagerService;
        this.webRequestContext = webRequestContext;
    }

    @Override
    @Contract("null -> fail; !null -> !null")
    public UserProfile loadUserByUsername(@Nullable String username) {
        if (isEmpty(username)) {
            log.debug("Passed an empty username");
            throw new UsernameNotFoundException("Empty username passed to UserService");
        }

        Localization localization = webRequestContext.getLocalization();

        String importSources = localization.getConfiguration(configContactImportSources);
        for (String source : nullToEmpty(importSources).split(",")) {
            UserProfile user = audienceManagerService.findContact(new ContactIdentifiers(username, source.trim()),
                    localization.getConfiguration(configUsernameField),
                    localization.getConfiguration(configPasswordField));

            if (user != null) {
                log.debug("Audience Manager identification key '{}' resolved to UserProfile '{}'", username, user);
                return user;
            }
        }
        throw new UsernameNotFoundException("No any Audience Manager Contacts found for id key " + username + " and import sources " + importSources);
    }
}
