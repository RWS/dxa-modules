package com.sdl.dxa.modules.model.TSI2316;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "NavigationTaxonomyKeywordMetadata", vocabulary = SDL_CORE)
public class Tsi2316TestKeyword extends KeywordModel {

    @SemanticProperty("TextField")
    public String textField;

    @SemanticProperty("NumberField")
    public Double numberField;

    @SemanticProperty("DateField")
    public DateTime dateField;

    @SemanticProperty("CompLinkField")
    public Link compLinkField;

    @SemanticProperty("KeywordField")
    private KeywordModel keywordField;
}
