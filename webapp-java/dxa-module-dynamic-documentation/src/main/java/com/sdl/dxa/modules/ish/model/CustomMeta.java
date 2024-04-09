package com.sdl.dxa.modules.ish.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CustomMeta {

    @JsonProperty("Key")
    private final String key;

    @JsonProperty("Value")
    private final String value;
}
