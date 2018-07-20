package com.sdl.dxa.modules.ugc.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>Ugc comment</p>
 */

@Data
public class Comment {
    private long id;

    @JsonIgnore
    private long parentId;

    private int itemPublicationId;

    private int itemId;

    private int itemType;

    @JsonFormat(shape = JsonFormat.Shape.OBJECT)
    private ZonedDateTime creationDate;

    @JsonFormat(shape = JsonFormat.Shape.OBJECT)
    private ZonedDateTime lastModifiedDate;

    private String content;

    private User user;

    private List<Comment> children;

    @JsonIgnore
    private int rating = 0;

    @JsonIgnore
    private Map<String, String> metadata = new HashMap<>();

}
