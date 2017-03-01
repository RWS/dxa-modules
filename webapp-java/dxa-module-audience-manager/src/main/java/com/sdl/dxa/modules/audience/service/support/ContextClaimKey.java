package com.sdl.dxa.modules.audience.service.support;

import lombok.Getter;

public enum ContextClaimKey {

    AUDIENCE_MANAGER_CONTACT_CLAIM("taf:claim:audiencemanager:contact:id"),

    PUBLICATION_ID_CLAIM("taf:claim:publication:id");

    @Getter
    private String key;

    ContextClaimKey(String key) {
        this.key = key;
    }
}
