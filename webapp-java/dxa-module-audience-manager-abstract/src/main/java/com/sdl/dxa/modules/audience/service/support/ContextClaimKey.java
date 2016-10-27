package com.sdl.dxa.modules.audience.service.support;

import lombok.Getter;

public enum ContextClaimKey {

    /**
     * While technically this is a valid claim, it's not expected to be used as claim. Used for {@linkplain com.sdl.dxa.modules.audience.service.AudienceManagerService#prepareClaims(String) AM workaround}.
     */
    HACK_APPLIED("am:hack:applied"),

    AUDIENCE_MANAGER_CONTACT_CLAIM("taf:claim:audiencemanager:contact:id"),

    REQUEST_FULL_URL_CLAIM("taf:request:full_url");

    @Getter
    private String key;

    ContextClaimKey(String key) {
        this.key = key;
    }
}
