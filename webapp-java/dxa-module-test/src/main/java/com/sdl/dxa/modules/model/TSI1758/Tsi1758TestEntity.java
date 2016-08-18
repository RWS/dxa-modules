package com.sdl.dxa.modules.model.TSI1758;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;


@EqualsAndHashCode(callSuper = true)
@Data
//@SemanticEntity(entityName = "TSI1758", vocabulary = SDL_CORE, prefix ="s")
@SemanticEntity(entityName = "TSI1758", vocabulary = SDL_CORE)
public class Tsi1758TestEntity extends AbstractEntityModel {

    //@SemanticProperty(propertyName = "s:embedField1")
    public List<Tsi1758TestEmbeddedEntity> embedField1;


    //@SemanticProperty(propertyName = "s:embedField2")
    public List<Tsi1758TestEmbeddedEntity> embedField2;

}


