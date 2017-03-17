package com.sdl.dxa.modules.model.TSI2316;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@SemanticEntity(entityName = "TSI2316", vocabulary = SDL_CORE)
public class Tsi2316TestEntity extends AbstractEntityModel {

    @JsonProperty("NotPublishedKeyword")
    public KeywordModel notPublishedKeyword;

    @JsonProperty("PublishedKeyword")
    public Tsi2316TestKeyword publishedKeyword;
}
