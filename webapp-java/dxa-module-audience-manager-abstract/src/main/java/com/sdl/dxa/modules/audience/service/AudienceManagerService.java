package com.sdl.dxa.modules.audience.service;

import com.sdl.dxa.modules.audience.model.ContactIdentifiers;
import com.sdl.dxa.modules.audience.model.UserProfile;
import org.jetbrains.annotations.Nullable;

/**
 * Interface to be implemented by concrete implementations of Audience Manager module
 * to provide access to Membership functionality of Audience Manager.
 */
public interface AudienceManagerService {

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
    UserProfile findContact(ContactIdentifiers contactIdentifiers, String usernameKey, String passwordKey);

    /**
     * Logs user with {@code id} in with Ambient Context.
     *
     * @param id id of current user
     */
    void login(String id);

    /**
     * Logs current user out.
     */
    void logout();
}
