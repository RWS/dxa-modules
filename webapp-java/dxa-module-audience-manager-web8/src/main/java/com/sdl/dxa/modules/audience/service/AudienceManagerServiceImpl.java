package com.sdl.dxa.modules.audience.service;

import com.sdl.audiencemanager.exceptions.AudienceManagerException;
import com.sdl.audiencemanager.odata_client.AudienceManagerClientException;
import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import com.sdl.dxa.modules.audience.model.UserProfileImpl;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.util.LocalizationUtils;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.dynamiccontent.DynamicMetaRetriever;
import com.tridion.marketingsolution.profile.Contact;
import com.tridion.marketingsolution.profile.ContactDoesNotExistException;
import com.tridion.marketingsolution.wrapper.ContactWrapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;

import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.AUDIENCE_MANAGER_CONTACT_CLAIM;
import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.HACK_APPLIED;
import static com.sdl.dxa.modules.audience.service.support.ContextClaimKey.REQUEST_FULL_URL_CLAIM;
import static com.sdl.webapp.common.util.LocalizationUtils.normalizePathToDefaults;
import static com.sdl.webapp.common.util.LocalizationUtils.replaceRequestContextPath;

@Service
@Slf4j
public class AudienceManagerServiceImpl implements AudienceManagerService {

    private final WebRequestContext webRequestContext;

    private final HttpServletRequest servletRequest;

    @Autowired
    public AudienceManagerServiceImpl(WebRequestContext webRequestContext, HttpServletRequest servletRequest) {
        this.webRequestContext = webRequestContext;
        this.servletRequest = servletRequest;
    }

    @Override
    public UserProfile findContact(ContactIdentifiers contactIdentifiers, String usernameKey, String passwordKey) {
        try {
            Contact contact = new Contact(contactIdentifiers.getIdentifiers());
            return new UserProfileImpl(contact, contactIdentifiers.getIdentificationKey(), usernameKey, passwordKey, contactIdentifiers);
        } catch (SQLException | IOException | ContactDoesNotExistException e) {
            log.debug("No user found for {}", contactIdentifiers, e);
            return null;
        } catch (Exception e) {
            log.warn("Unknown exception in Audience Manager, cannot get user for {}", contactIdentifiers, e);
            return null;
        }
    }

    @SuppressWarnings("ConstantConditions")
    @Override
    public void prepareClaims(String url) {
        if (servletRequest.getAttribute(HACK_APPLIED.getKey()) != null) {
            log.trace("AM hack is already applied for this request, skipping.");
            return;
        }

        replaceFullUrlClaim(url);
        try {
            // CRQ-2502
            // this is a really dirty hack to reset AM caching since they don't provide any public API for this
            // we could've called PublicationContext.clearCache() since it's public, but it's only technically public
            // and is not a part of official public API
            if (null == new ContactWrapper()) { //NOSONAR
                throw new IllegalStateException("This should never happen");
            }
        } catch (AudienceManagerException | AudienceManagerClientException | IOException e) {
            log.warn("Exception in Audience Manager", e);
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
        String newFullUrl = selectUrlByTryingToRetrievePage(url, url + "/", "/");

        if (newFullUrl == null) {
            log.warn("DXA wanted to set a new full url but failed to find a page for current url");
            return;
        }

        claimStore.getReadOnly().remove(claimFullUrl);
        claimStore.put(claimFullUrl, newFullUrl);
        servletRequest.setAttribute(HACK_APPLIED.getKey(), newFullUrl);
    }

    @Nullable
    private String selectUrlByTryingToRetrievePage(String... urls) {
        DynamicMetaRetriever dynamicMetaRetriever = new DynamicMetaRetriever();
        for (String url : urls) {
            String path = replaceRequestContextPath(webRequestContext, normalizePathToDefaults(url));
            if (null != dynamicMetaRetriever.getPageMetaByURL(path)) {
                return path;
            }
        }
        return null;
    }
}