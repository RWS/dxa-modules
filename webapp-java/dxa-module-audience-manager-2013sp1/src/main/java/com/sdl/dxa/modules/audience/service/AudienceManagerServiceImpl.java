package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.model.UserProfileImpl;
import com.sdl.webapp.common.api.WebRequestContext;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.marketingsolution.profile.Contact;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;

import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.AUDIENCE_MANAGER_CONTACT_CLAIM;
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
            replaceFullUrlClaim();
            return new UserProfileImpl(new Contact(contactIdentifiers.getIdentifiers()), usernameKey, passwordKey);
        } catch (SQLException | IOException e) {
            log.debug("No user found for {}", contactIdentifiers, e);
            return null;
        }
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
    private void replaceFullUrlClaim() {
        ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
        if (claimStore == null) {
            log.warn("There is no current ClaimStore set, cannot modify full_url needed for resolving a contact");
            return;
        }
        URI claimFullUrl = new URI("taf:request:full_url");
        claimStore.getAllReadOnlyClaims().remove(claimFullUrl);
        claimStore.put(claimFullUrl, replaceRequestContextPath(webRequestContext, normalizePathToDefaults(webRequestContext.getPage().getUrl())));
    }

}
