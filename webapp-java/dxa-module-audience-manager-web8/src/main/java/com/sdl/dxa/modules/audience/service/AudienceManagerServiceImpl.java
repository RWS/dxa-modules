package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.model.UserProfileImpl;
import com.sdl.webapp.common.api.WebRequestContext;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.marketingsolution.profile.Contact;
import com.tridion.marketingsolution.profile.ContactDoesNotExistException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
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
public class AudienceManagerServiceImpl implements AudienceManagerService {

    private final WebRequestContext webRequestContext;

    @Autowired
    public AudienceManagerServiceImpl(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    @Override
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

            return new UserProfileImpl(new Contact(contactIdentifiers.getIdentifiers()),
                    contactIdentifiers.getIdentificationKey(), usernameKey, passwordKey, contactIdentifiers);
        } catch (SQLException | IOException | ContactDoesNotExistException e) {
            log.debug("No user found for {}", contactIdentifiers, e);
            return null;
        } catch (Exception e) {
            log.warn("Unknown exception in Audience Manager, cannot get user for {}", contactIdentifiers, e);
            return null;
        }
    }

    /**
     * @deprecated since 1.7
     */
    @SuppressWarnings("ConstantConditions")
    @Override
    @Deprecated
    public void prepareClaims(String url) {
        log.warn("The method is deprecated and its contents was removed => does nothing, don't use it");
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
}