package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

import static com.google.common.base.Strings.nullToEmpty;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Slf4j
@Service
public class AudienceManagerUserService implements UserDetailsService {

    private final WebRequestContext webRequestContext;

    private final AudienceManagerService audienceManagerService;

    @Autowired
    public AudienceManagerUserService(WebRequestContext webRequestContext, HttpServletRequest httpServletRequest, AudienceManagerService audienceManagerService) {
        this.webRequestContext = webRequestContext;
        this.audienceManagerService = audienceManagerService;
    }

    @Nullable
    @Override
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
}
