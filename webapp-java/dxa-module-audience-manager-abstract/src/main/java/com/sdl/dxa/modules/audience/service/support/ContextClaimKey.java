package com.sdl.dxa.modules.audience.service.support;

import lombok.Getter;

public enum ContextClaimKey {

    AUDIENCE_MANAGER_CONTACT_CLAIM("taf:claim:audiencemanager:contact:id"),

    PUBLICATION_ID_CLAIM("taf:claim:publication:id"),

    /**
     * @deprecated since 1.7
     */
    @Deprecated
    REQUEST_FULL_URL_CLAIM("taf:request:full_url"),

    /**
     * While technically this is a valid claim, it's not expected to be used as claim. Used for {@linkplain com.sdl.dxa.modules.audience.service.AudienceManagerService#prepareClaims(String) AM workaround}.
     *
     * @deprecated since 1.7
     */
    @Deprecated
    HACK_APPLIED("am:hack:applied");

    @Getter
    private String key;

    ContextClaimKey(String key) {
        this.key = key;
    }
}
