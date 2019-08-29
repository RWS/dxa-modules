package com.sdl.dxa.modules.ugc.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.Data;
import org.joda.time.DateTime;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>Ugc comment</p>
 */

@Data
public class Comment {
    @JsonProperty("id")
    private long id;

    @JsonProperty("parentId")
    private long parentId;

    @JsonProperty("itemPublicationId")
    private int itemPublicationId;

    @JsonProperty("itemId")
    private int itemId;

    @JsonProperty("itemType")
    private int itemType;

    @JsonProperty(value = "creationDate")
    @JsonRawValue
    private String creationDate;

    @JsonProperty("lastModifiedDate")
    @JsonRawValue
    private String lastModifiedDate;

    @JsonIgnore
    private DateTime creationDateTime;

    @JsonIgnore
    private DateTime lastModifiedDateTime;

    @JsonProperty("content")
    private String content;

    @JsonProperty("user")
    private User user;

    @JsonProperty("children")
    private List<Comment> children;

    @JsonIgnore
    private int rating = 0;

    @JsonProperty(value = "metadata")
    private Map<String, String> metadata = new HashMap<>();

}
