package com.sdl.dxa.modules.docs.mashup.models.products;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.MediaItem;
import java.util.Map;

public class Product extends AbstractEntityModel {

    @SemanticProperty("_all")
    private Map<String, KeywordModel> keywords;

    @SemanticProperty("Title")
    private String title;

    @SemanticProperty("Body")
    private RichText body;

    @SemanticProperty("Image")
    private MediaItem image;

    public Map<String, KeywordModel> getKeywords() {
        return keywords;
    }

    public void setKeywords(Map<String, KeywordModel> keywords) {
        this.keywords = keywords;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) { this.title = title; }

    public RichText getBody() {
        return body;
    }

    public void setBody(RichText body) {
        this.body = body;
    }

    public MediaItem getImage() {
        return image;
    }

    public void setImage(MediaItem image) {
        this.image = image;
    }
}
