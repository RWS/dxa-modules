package com.sdl.dxa.modules.ugc.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private long id;

    private long parentId;

    private int itemPublicationId;

    private int itemId;

    private int itemType;

    private DateTime creationDate;

    private DateTime lastModifiedDate;

    private String content;

    private User user;

    private List<Comment> children;

    @JsonIgnore
    private int rating = 0;

    private Map<String, String> metadata = new HashMap<>();

}
