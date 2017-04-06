package com.sdl.dxa.modules.model.TSI2315;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import org.joda.time.DateTime;

import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@SemanticEntity(entityName = "Content", vocabulary = SDL_CORE, prefix = "s")
public class TestEntity extends AbstractEntityModel {

    @SemanticProperty("s:SingleLineText")
    private List<String> singleLineTextField;

    @SemanticProperty("s:MultiLineText")
    private List<String> multiLineTextField;

    @SemanticProperty("s:RichText")
    private List<RichText> richTextField;

    @SemanticProperty("s:Date")
    private DateTime dateField;
}
