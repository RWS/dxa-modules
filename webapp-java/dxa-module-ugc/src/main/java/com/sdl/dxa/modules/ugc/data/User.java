package com.sdl.dxa.modules.ugc.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>Ugc User information</p>
 */
@Data
public class User {
    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("emailAddress")
    private String emailAddress;

    @JsonProperty("externalId")
    private String externalId;
}
