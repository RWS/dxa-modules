package com.sdl.dxa.modules.model.TSI811;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "TSI811", vocabulary = SDL_CORE)
public class Tsi811TestEntity extends AbstractEntityModel {

    @JsonProperty("Keyword1")
    private List<Tsi811TestKeyword> keyword1;

    @JsonProperty("Keyword2")
    private KeywordModel keyword2;

    @JsonProperty("BooleanProperty")
    private String booleanKeyword;
}
