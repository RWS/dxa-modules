package com.sdl.dxa.modules.model.TSI1757;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Created by adosenko on 15.12.2016.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "Content", vocabulary = "uuid:a3cbac3c-375a-43d3-937e-788110d6b9ee", prefix = "s1")
public class Tsi1757TestEntity1 extends Tsi1757TestEntity {

    @SemanticProperty("s1:textField")
    public String textField;

    @SemanticProperty("s1:embeddedTextField")
    public String embeddedTextField;
}
