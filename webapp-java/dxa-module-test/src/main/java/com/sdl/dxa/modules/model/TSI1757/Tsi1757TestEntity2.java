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
@SemanticEntity(entityName = "Content", vocabulary = "uuid:3a50c82e-f113-4e7d-94f5-23359b3b0a4e", prefix = "s2")
public class Tsi1757TestEntity2 extends Tsi1757TestEntity {

    @SemanticProperty("s2:textField")
    public String textField;
}
