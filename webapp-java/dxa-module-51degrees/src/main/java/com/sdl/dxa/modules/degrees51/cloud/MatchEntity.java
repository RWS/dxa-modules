package com.sdl.dxa.modules.degrees51.cloud;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchEntity {
    @JsonProperty("Values")
    private Map<String, List<String>> values;

    @JsonProperty("Useragent")
    private String useragent;

    @JsonProperty("Difference")
    private int difference;
}
