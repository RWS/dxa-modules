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

    @JsonIgnore
    private long parentId;

    private int itemPublicationId;

    private int itemId;

    private int itemType;

    private CommentDate creationDate;

    private CommentDate lastModifiedDate;

    private String content;

    private User user;

    private List<Comment> children;

    @JsonIgnore
    private int rating = 0;

    @JsonIgnore
    private Map<String, String> metadata = new HashMap<String, String>();

    @Data
    public static class CommentDate {
        @JsonIgnore
        private DateTime dateTime;

        private int dayOfMonth;

        private String dayOfWeek;

        private int dayOfYear;

        private int hour;

        private int minute;

        private String month;

        private int monthValue;

        private int nano;

        private int second;

        private int year;
    }

}
