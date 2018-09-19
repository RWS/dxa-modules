package com.sdl.dxa.modules.docs.mashup.models.widgets;

import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.api.mapping.semantic.annotations.*;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.EqualsAndHashCode;
import java.util.Map;
import com.sdl.webapp.common.api.model.KeywordModel;
import java.util.List;

@NeverCached(qualifier = "StaticWidget")
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "Content")
public class StaticWidget extends AbstractEntityModel {

    @SemanticProperty("_all")
    private Map<String, KeywordModel> keywords;

    @SemanticProperty("DisplayContentAs")
    private String displayContentAs;

    @SemanticProperty("MaxNumberOfItemsToShow")
    private Integer maxItems;

    @SemanticMappingIgnore
    private List<Topic> topics;

    public Map<String, KeywordModel> getKeywords() {
        return keywords;
    }

    public void setKeywords(Map<String, KeywordModel> keywords) {
        this.keywords = keywords;
    }

    public String getDisplayContentAs() {
        return displayContentAs;
    }

    public void setDisplayContentAs(String displayContentAs) {
        this.displayContentAs = displayContentAs;
    }

    public Integer getMaxItems() {
        return maxItems;
    }

    public void setMaxItems(Integer maxItems) {
        this.maxItems = maxItems;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

}
