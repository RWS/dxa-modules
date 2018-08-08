package com.sdl.dxa.modules.docs.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * SearchResultSet represents data structure which contains search results alongside with additional search data.
 */
@Data
public class SearchResultSet {

    @JsonProperty("Hits")
    private Integer hits;

    @JsonProperty("Count")
    private Integer count;

    @JsonProperty("StartIndex")
    private Integer startIndex;

    @JsonProperty("QueryResults")
    private List<SearchResult> queryResults;
}
