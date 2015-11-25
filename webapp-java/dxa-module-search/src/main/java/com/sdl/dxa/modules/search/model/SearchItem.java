package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

import java.util.Map;

/**
 * Contains the default fields that come back from Result, Excluded PublicationId and Id.
 */
public class SearchItem extends AbstractEntityModel {

    @JsonProperty("Title")
    private String title;

    @JsonProperty("Url")
    private String url;

    @JsonProperty("Summary")
    private String summary;

    @JsonProperty("CustomFields")
    private Map<String, Object> customFields;
}
