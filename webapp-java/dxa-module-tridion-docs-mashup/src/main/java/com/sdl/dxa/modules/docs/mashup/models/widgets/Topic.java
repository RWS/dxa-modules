package com.sdl.dxa.modules.docs.mashup.models.widgets;

import com.sdl.webapp.common.api.model.RichText;
import lombok.Data;

@Data
public class Topic {

    private String id;
    private RichText title;
    private String link;
    private RichText body;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RichText getTitle() {
        return title;
    }

    public void setTitle(RichText title) {
        this.title = title;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public RichText getBody() {
        return body;
    }

    public void setBody(RichText body) {
        this.body = body;
    }

}
