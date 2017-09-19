package com.sdl.dxa.modules.model.TSI2525;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import org.joda.time.DateTime;

import java.text.SimpleDateFormat;
import java.util.Date;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@Data
@SemanticEntity(entityName = "NoCachePropertyTest", vocabulary = SDL_CORE, prefix = "test")
public class CacheEntityModel extends AbstractEntityModel {

    @SemanticProperty("test:textField")
    private String textField;

    @SemanticProperty("test:numberField")
    private Integer numberField;

    @SemanticProperty("test:dateField")
    private DateTime dateField;

    private String dateNow = new SimpleDateFormat("MM/dd/yy HH:mm:ss").format(new Date());

    public CacheEntityModel() throws ClassNotFoundException {
        TestCacheListenerExtender.registerListeners();
    }
}
