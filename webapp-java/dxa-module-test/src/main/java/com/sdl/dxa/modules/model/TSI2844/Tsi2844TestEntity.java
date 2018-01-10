package com.sdl.dxa.modules.model.TSI2844;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntities;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntities({
        @SemanticEntity(entityName = "SimpleTestEntity"),
        @SemanticEntity(entityName = "FolderSchema", vocabulary = SDL_CORE, prefix = "f")
})
public class Tsi2844TestEntity extends AbstractEntityModel {

    @JsonProperty("SingleLineText")
    private String singleLineText;

    @JsonProperty("MetadataTextField")
    private String metadataTextField;

    @SemanticProperty("f:folderMetadataTextField")
    @JsonProperty("FolderMetadataTextField")
    private String folderMetadataTextField;
}
