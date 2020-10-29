package com.sdl.dxa.modules.docs.search.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;

/**
 * Search Parameters represents data structure used in requests to search.
 */
@Data
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchParameters {
    private static final String DEFAULT_LANGUAGE = "en";
    private static final Integer DEFAULT_START_INDEX = 0;
    private static final Integer DEFAULT_RESULT_COUNT = 10;
    private static final String DEFAULT_SEARCH_QUERY = "";

    @JsonProperty("PublicationId")
    private Integer publicationId;

    @JsonProperty("Language")
    private String language = DEFAULT_LANGUAGE;

    @JsonProperty("SearchQuery")
    private String searchQuery = DEFAULT_SEARCH_QUERY;

    @JsonProperty("StartIndex")
    private Integer startIndex = DEFAULT_START_INDEX;

    @JsonProperty("Count")
    private Integer count = DEFAULT_RESULT_COUNT;

    @JsonIgnore
    private String iqNamespace;

    @JsonIgnore
    private String iqSeparator;
}
