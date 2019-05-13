package com.sdl.dxa.modules.docs.mashup.models.widgets;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperties;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import lombok.Data;

import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_DITA;

@Data
@SemanticEntity(entityName = "title", vocabulary = SDL_DITA)
public class Topic extends AbstractEntityModel {

    private String id;
    @SemanticProperty("title")
    private RichText title;
    @SemanticMappingIgnore
    private String link;
    @SemanticProperty("body")
    private RichText body;
    @SemanticProperties({@SemanticProperty("nested1"), @SemanticProperty("nested2")})
    private List<Topic> nestedTopics;

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

    public List<Topic> getNestedTopics() {
        return nestedTopics;
    }

    public void setNestedTopics(List<Topic> nestedTopics) {
        this.nestedTopics = nestedTopics;
    }

    @Override
    public MvcData getDefaultMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("TridionDocsMashup:Entity:Topic")
                .defaults(DefaultsMvcData.ENTITY)
                .create();
    }
}
