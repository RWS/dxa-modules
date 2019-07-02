package com.sdl.dxa.modules.dd.models;

import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

//[SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "Topic", Prefix = "s", Public = true)]
public class Topic extends AbstractEntityModel {
    //        [SemanticProperty("topicBody")]
//        [JsonProperty(PropertyName = "topicBody")]
    private RichText topicBody;

    //        [SemanticProperty("topicTitle")]
//        [JsonProperty(PropertyName = "topicTitle")]
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
