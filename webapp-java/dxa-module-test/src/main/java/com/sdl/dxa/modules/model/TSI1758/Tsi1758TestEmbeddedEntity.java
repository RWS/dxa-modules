package com.sdl.dxa.modules.model.TSI1758;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@EqualsAndHashCode(callSuper = true)
@Data
@SemanticEntity(entityName = "TSI1758Embed", vocabulary = SDL_CORE)
//@SemanticEntity(entityName = "TSI1758Embed", vocabulary = SDL_CORE,prefix = "s")
public class Tsi1758TestEmbeddedEntity extends AbstractEntityModel {

    //@SemanticProperty(propertyName = "s:textField")
    public String textField;

    //@SemanticProperty(propertyName = "s:embedField1")
    public Link embedField1;

    //@SemanticProperty(propertyName = "s:embedField2")
    public Tsi1758TestEmbedded2Entity embedField2;


    @Override
    public MvcData getMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("Test:TSI1758TestEmbedded")
                .defaults(DefaultsMvcData.CORE_ENTITY).create();
    }

}


