package com.sdl.dxa.modules.audience.service.support;

import lombok.Getter;

public enum ContextClaimKey {

    AUDIENCE_MANAGER_CONTACT_CLAIM("taf:claim:audiencemanager:contact:id"),

    REQUEST_FULL_URL_CLAIM("taf:request:full_url");

    @Getter
    private String key;

    ContextClaimKey(String key) {
        this.key = key;
    }
}
