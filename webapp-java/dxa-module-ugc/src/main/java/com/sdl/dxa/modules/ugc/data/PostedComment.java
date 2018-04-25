package com.sdl.dxa.modules.ugc.data;

import lombok.Data;

@Data
public class PostedComment {
    private int publicationId;

    private int pageId;

    private String username;

    private String email;

    private String content;

    private int parentId = 0;

    private String publicationTitle;

    private String publicationUrl;

    private String pageTitle;

    private String pageUrl;

    private String language;
}
