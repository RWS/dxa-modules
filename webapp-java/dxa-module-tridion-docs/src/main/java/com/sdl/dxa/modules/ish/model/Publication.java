package com.sdl.dxa.modules.ish.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Model for publication title.
 */
@Data
public class Publication {

    @JsonProperty("Id")
    private String id;

    @JsonProperty("Title")
    private String title;

    @JsonProperty("ProductFamily")
    private List<String> productFamily;

    @JsonProperty("ProductReleaseVersion")
    private List<String> productReleaseVersion;

    @JsonProperty("VersionRef")
    private String versionRef;

    @JsonProperty("Language")
    private String language;

    @JsonProperty("CreatedOn")
    private String createdOn;

    @JsonProperty("Version")
    private String version;

    @JsonProperty("LogicalId")
    private String logicalId;
}
