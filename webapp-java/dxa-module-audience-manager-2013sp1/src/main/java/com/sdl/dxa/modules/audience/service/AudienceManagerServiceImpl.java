package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.model.UserProfileImpl;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.marketingsolution.profile.Contact;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;

import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.AUDIENCE_MANAGER_CONTACT_CLAIM;

@Service
@Slf4j
public class AudienceManagerServiceImpl implements AudienceManagerService {

    @Override
    public UserProfile findContact(ContactIdentifiers contactIdentifiers, String usernameKey, String passwordKey) {
        try {
            Contact contact = new Contact(contactIdentifiers.getIdentifiers());
            return new UserProfileImpl(contact, contactIdentifiers.getIdentificationKey(), usernameKey, passwordKey, contactIdentifiers);
        } catch (SQLException | IOException e) {
            log.debug("No user found for {}", contactIdentifiers, e);
            return null;
        } catch (Exception e) {
            log.warn("Unknown exception in Audience Manager, cannot get user for {}", contactIdentifiers, e);
            return null;
        }
    }

    @Override
    public void prepareClaims(String url) {
        log.trace("There is no need to prepare claims for 2013sp1, skipping");
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
