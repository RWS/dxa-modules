package com.sdl.dxa.modules.audience.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;

import static org.apache.commons.lang3.StringUtils.isEmpty;

/**
 * Wrapper for identifiers for Contact in AM.
 */
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class ContactIdentifiers implements Serializable {

    @Getter
    private String identificationKey;

    private String importSource;

    /**
     * Returns an array of id key and import source to pass to AM API.
     *
     * @return an array key + import source, or just key if the latter is empty
     */
    public String[] getIdentifiers() {
        return isEmpty(importSource) ? new String[]{identificationKey} : new String[]{identificationKey, importSource};
    }
}
