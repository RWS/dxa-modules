package com.sdl.dxa.modules.model.embed;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@EqualsAndHashCode(callSuper = true)
@Data
@SemanticEntity(entityName = "EmbedParent", vocabulary = SDL_CORE, prefix = "s", public_ = true)
public class EmbedParent extends AbstractEntityModel {

    @JsonProperty("Title")
    @SemanticProperty("s:Title")
    private String title;

    @JsonProperty("EmbeddedEntity")
    @SemanticProperty("s:EmbeddedEntity")
    private EmbedChild embeddedEntity;
}



