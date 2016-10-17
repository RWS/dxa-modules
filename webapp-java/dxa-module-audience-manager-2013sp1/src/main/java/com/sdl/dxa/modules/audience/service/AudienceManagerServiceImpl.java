package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.model.UserProfileImpl;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.util.LocalizationUtils;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.marketingsolution.profile.Contact;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.AUDIENCE_MANAGER_CONTACT_CLAIM;
import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.REQUEST_FULL_URL_CLAIM;
import static com.sdl.webapp.common.util.LocalizationUtils.normalizePathToDefaults;
import static com.sdl.webapp.common.util.LocalizationUtils.replaceRequestContextPath;

@Service
@Slf4j
public class AudienceManagerServiceImpl implements AudienceManagerService {

    private final WebRequestContext webRequestContext;

    @Autowired
    public AudienceManagerServiceImpl(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    @Override
    public UserProfile findContact(ContactIdentifiers contactIdentifiers, String usernameKey, String passwordKey) {
        try {
            return new UserProfileImpl(new Contact(contactIdentifiers.getIdentifiers()), usernameKey, passwordKey, contactIdentifiers);
        } catch (SQLException | IOException e) {
            log.debug("No user found for {}", contactIdentifiers, e);
            return null;
        }
    }

    @Override
    public void prepareClaims(LoginForm form) {
        replaceFullUrlClaim(form.getLoginFormUrl());
    }

    @Override
    @SneakyThrows(URISyntaxException.class)
    public void login(String id) {
        AmbientDataContext.getCurrentClaimStore().put(new URI(AUDIENCE_MANAGER_CONTACT_CLAIM.getKey()), id);
    }

    @Override
    @SneakyThrows(URISyntaxException.class)
    public void logout() {
        AmbientDataContext.getCurrentClaimStore().remove(new URI(AUDIENCE_MANAGER_CONTACT_CLAIM.getKey()));
    }

    @SneakyThrows(URISyntaxException.class)
    private void replaceFullUrlClaim(String url) {
        ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
        if (claimStore == null) {
            log.warn("There is no current ClaimStore set, cannot modify full_url needed for resolving a contact");
            return;
        }
        URI claimFullUrl = new URI(REQUEST_FULL_URL_CLAIM.getKey());

        String fullUrl = (String) claimStore.get(claimFullUrl);
        if (LocalizationUtils.hasDefaultExtension(fullUrl)) {
            log.trace("Url {} already has default extension, no need to replace it", fullUrl);
            return;
        }

        log.debug("Url {} has no default extension, so we need to hack the claim to be able to resolve the contact", fullUrl);
        Set<URI> readOnlyClaims = claimStore.getAllReadOnlyClaims();
        Set<URI> readOnlyHacked = new HashSet<>();
        for (URI uri : readOnlyClaims) {
            if (!uri.equals(claimFullUrl)) {
                readOnlyHacked.add(uri);
            }
        }

        Field field;
        try {
            field = ClaimStore.class.getDeclaredField("readOnly");
            field.setAccessible(true);

            Field modifiers = Field.class.getDeclaredField("modifiers");
            modifiers.setAccessible(true);
            modifiers.setInt(field, field.getModifiers() & ~Modifier.FINAL);

            field.set(claimStore, readOnlyHacked);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.warn("DXA attempted to set ClaimStore read-only value for Full Url but failed. " +
                    "Most probably we won't be able to resolve contact", e);
            return;
        }

        String newUrl = replaceRequestContextPath(webRequestContext, normalizePathToDefaults(url));
        claimStore.put(claimFullUrl, newUrl);
        log.trace("Set full url claim '{}' to '{}'", claimFullUrl, newUrl);
    }

}
