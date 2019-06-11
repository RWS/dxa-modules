package com.sdl.dxa.modules.model.TSI811;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "TSI811PageMetadataSchema", vocabulary = SDL_CORE)
@NoArgsConstructor
public class Tsi811PageModel extends DefaultPageModel {

    @JsonProperty("PageKeyword")
    private Tsi811TestKeyword pageKeyword;

    public Tsi811PageModel(DefaultPageModel other) {
        super(other);
        if (other instanceof Tsi811PageModel) {
            this.pageKeyword = ((Tsi811PageModel) other).pageKeyword;
        }
    }

    @Override
    public PageModel deepCopy() {
        return new Tsi811PageModel(this);
    }
}
