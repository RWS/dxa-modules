package com.sdl.dxa.modules.docs.mashup.models.products;

import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import lombok.EqualsAndHashCode;

@NeverCached(qualifier = "Bicycle")
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "Bicycle")
public class Bicycle extends Product {

}