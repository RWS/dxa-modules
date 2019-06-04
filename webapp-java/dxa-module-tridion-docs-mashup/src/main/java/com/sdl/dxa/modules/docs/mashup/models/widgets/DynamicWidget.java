package com.sdl.dxa.modules.docs.mashup.models.widgets;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "DynamicWidget")
public class DynamicWidget extends AbstractEntityModel {

    @SemanticProperty("Keywords")
    private List<String> keywords;

    @SemanticProperty("ProductViewModel")
    private String productViewModel;

    @SemanticProperty("DisplayContentAs")
    private String displayContentAs;

    @SemanticProperty("MaxNumberOfItemsToShow")
    private Integer maxItems;

    @SemanticMappingIgnore
    private List<Topic> topics;

    public String getProductViewModel() {
        return productViewModel;
    }

    public void setProductViewModel(String productViewModel) {
        this.productViewModel = productViewModel;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
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
