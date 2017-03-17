package com.sdl.dxa.modules.model.TSI2316;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;
import org.joda.time.DateTime;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@SemanticEntity(entityName = "NavigationTaxonomyKeywordMetadata", vocabulary = SDL_CORE)
public class Tsi2316TestKeyword extends KeywordModel {

    @JsonProperty("TextField")
    @SemanticProperty("TextField")
    public String textField;

    @JsonProperty("NumberField")
    @SemanticProperty("NumberField")
    public Double numberField;

    @JsonProperty("DateField")
    @SemanticProperty("DateField")
    public DateTime dateField;

    @JsonProperty("CompLinkField")
    @SemanticProperty("CompLinkField")
    public Link compLinkField;

    @JsonProperty("KeywordField")
    @SemanticProperty("KeywordField")
    private KeywordModel keywordField;
}
