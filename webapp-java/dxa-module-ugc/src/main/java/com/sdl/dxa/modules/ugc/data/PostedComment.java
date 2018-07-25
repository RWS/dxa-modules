package com.sdl.dxa.modules.ugc.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>Ugc posted comment</p>
 */

@Data
public class PostedComment {
    @JsonProperty("publicationId")
    private int publicationId;
    @JsonProperty("pageId")
    private int pageId;
    @JsonProperty("username")
    private String userName;
    @JsonProperty("email")
    private String email;
    @JsonProperty("content")
    private String content;
    @JsonProperty("parentId")
    private int parentId = 0;
    @JsonProperty("publicationTitle")
    private String publicationTitle;
    @JsonProperty("formUrl")
    private String formUrl;
    @JsonProperty("target")
    private String target;
    @JsonProperty("publicationUrl")
    private String publicationUrl;
    @JsonProperty("pageTitle")
    private String pageTitle;
    @JsonProperty("pageUrl")
    private String pageUrl;
    @JsonProperty("language")
    private String language;
    @JsonProperty("status")
    private String status;
    @JsonProperty("itemTitle")
    private  String itemTitle;
    @JsonProperty("itemUrl")
    private String itemUrl;
}
