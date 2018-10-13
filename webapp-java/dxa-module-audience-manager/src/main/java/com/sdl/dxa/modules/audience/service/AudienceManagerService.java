package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.webapp.common.api.WebRequestContext;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.marketingsolution.profile.Contact;
import com.tridion.marketingsolution.profile.ContactDoesNotExistException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;

import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.AUDIENCE_MANAGER_CONTACT_CLAIM;
import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.PUBLICATION_ID_CLAIM;

@Service
@Slf4j
public class AudienceManagerService {

    private final WebRequestContext webRequestContext;

    @Autowired
    public AudienceManagerService(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    /**
     * Tries to resolve contact in Audience Manager using the given {@link ContactIdentifiers}
     * and returns a version-independent wrapper.
     *
     * @param contactIdentifiers contact identifiers to find in AM
     * @param usernameKey        key for username to resolve it from details of contact
     * @param passwordKey        key for password to resolve it from details of contact
     * @return user profile if contact was found, or {@code null} otherwise
     */
    @Nullable
    public UserProfile findContact(ContactIdentifiers contactIdentifiers, String usernameKey, String passwordKey) {
        try {
            ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
            if (claimStore == null) {
                log.warn("There is no current ClaimStore set, cannot set {} needed for resolving a contact", PUBLICATION_ID_CLAIM.getKey());
                return null;
            }

            // Audience Manager reads the context Publication ID from ADF
            log.trace("Set {} to {}", PUBLICATION_ID_CLAIM.getKey(), webRequestContext.getLocalization().getId());
            claimStore.put(new URI(PUBLICATION_ID_CLAIM.getKey()), webRequestContext.getLocalization().getId());

            return new UserProfile(new Contact(contactIdentifiers.getIdentifiers()),
                    contactIdentifiers.getIdentificationKey(), usernameKey, passwordKey, contactIdentifiers);
        } catch (SQLException | IOException | ContactDoesNotExistException e) {
            log.warn("No user found for {}" + contactIdentifiers, e);
            return null;
        } catch (Exception e) {
            log.error("Unknown exception in Audience Manager, cannot get user for {}" + contactIdentifiers, e);
            return null;
        }
    }

    /**
     * Logs user with {@code id} in with Ambient Context.
     *
     * @param id id of current user
     */
    @SneakyThrows(URISyntaxException.class)
    public void login(String id) {
        AmbientDataContext.getCurrentClaimStore().put(new URI(AUDIENCE_MANAGER_CONTACT_CLAIM.getKey()), id);
    }

    /**
     * Logs current user out.
     */
    @SneakyThrows(URISyntaxException.class)
    public void logout() {
        AmbientDataContext.getCurrentClaimStore().remove(new URI(AUDIENCE_MANAGER_CONTACT_CLAIM.getKey()));
    }
}