package com.sdl.dxa.modules.model.TSI1757;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * Created by adosenko on 15.12.2016.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "Content", vocabulary = "uuid:e6b74fb5-d407-4baa-ab53-ef1bc0b72887", prefix = "s3")
public class Tsi1757TestEntity3 extends Tsi1757TestEntity {

    @SemanticProperty("s3:textField")
    public String textField;

    @SemanticProperty("s3:compLinkField")
    public List<Tsi1757TestEntity> compLinkField;
}
