package com.sdl.dxa.modules.ugc.data;

import lombok.Data;

/**
 * <p>Ugc posted comment</p>
 */

@Data
public class PostedComment {
    private int publicationId;

    private int pageId;

    private String userName;

    private String emailAddress;

    private String content;

    private int parentId = 0;

    private String publicationTitle;

    private String formUrl;

    private String target;

    private String publicationUrl;

    private String pageTitle;

    private String pageUrl;

    private String language;

    private String status;

    private  String itemTitle;

    private String itemUrl;

    private String _csrf;
}
