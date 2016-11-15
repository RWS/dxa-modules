package com.sdl.dxa.modules.model.TSI811;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "TSI811PageMetadataSchema", vocabulary = SDL_CORE)
public class Tsi811PageModel extends DefaultPageModel {

    @JsonProperty("PageKeyword")
    private Tsi811TestKeyword pageKeyword;
}
