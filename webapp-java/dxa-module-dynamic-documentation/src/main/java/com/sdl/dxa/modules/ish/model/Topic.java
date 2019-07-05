package com.sdl.dxa.modules.ish.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

/**
 * Topic model.
 */
@SemanticEntity(entityName = "Topic", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
@Data
@EqualsAndHashCode(callSuper = true)
public class Topic extends AbstractEntityModel {

    @SemanticProperty("topicBody")
    @JsonProperty("topicBody")
    private RichText topicBody;

    @SemanticProperty("topicTitle")
    @JsonProperty("topicTitle")
    private String topicTitle;

    public RichText getTopicBody() {
        return topicBody;
    }

    public void setTopicBody(RichText topicBody) {
        this.topicBody = topicBody;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }
}
