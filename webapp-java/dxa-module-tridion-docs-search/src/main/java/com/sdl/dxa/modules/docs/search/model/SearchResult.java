package com.sdl.dxa.modules.docs.search.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Search Result represents data structure for single search result.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchResult {
    @JsonProperty("Id")
    private String id;

    @JsonProperty("Meta")
    private Map<String, Object> fields;

    @JsonProperty("Locale")
    private Locale locale;

    @JsonProperty("Highlighted")
    private Map<String, List<String>> highlighted;

    @JsonProperty("Content")
    private String content;

    @JsonProperty("CreatedDate")
    private String createdDate;

    @JsonProperty("ModifiedDate")
    private String modifiedDate;

    @JsonProperty("PublicationId")
    private Integer publicationId;

    @JsonProperty("PublicationTitle")
    private String publicationTitle;

    @JsonProperty("ProductFamilyName")
    private String productFamilyName;

    @JsonProperty("ProductReleaseName")
    private String productReleaseName;
}
