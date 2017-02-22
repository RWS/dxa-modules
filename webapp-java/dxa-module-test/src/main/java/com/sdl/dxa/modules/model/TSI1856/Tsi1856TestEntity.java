package com.sdl.dxa.modules.model.TSI1856;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntities;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperties;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntities({
        @SemanticEntity(entityName = "TSI1856", vocabulary = SDL_CORE, prefix = "test"),
        @SemanticEntity(entityName = "TSI1856", vocabulary = "uuid:d4473ba5-05e0-4320-bfd6-6fbb9eb6265e", prefix = "test-r"),
        @SemanticEntity(entityName = "TSI1856EmbedMeta", vocabulary = SDL_CORE, prefix = "m")
})
public class Tsi1856TestEntity extends AbstractEntityModel {

    @SemanticProperties({
            @SemanticProperty("test:title"),
            @SemanticProperty("test-r:title")
    })
    @JsonProperty("TitleComponent")
    private String titleComponent;

    @SemanticProperty("m:title")
    @JsonProperty("TitleMeta")
    private String titleMeta;
}
