package com.sdl.dxa.modules.core.model.region;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.base.Strings;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

@SemanticEntity(entityName = "MultiColumnRegion", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
@Data
@EqualsAndHashCode(callSuper = true)
public class MultiColumnRegion extends RegionModelImpl {

    @SemanticProperty("s:numberOfColumns")
    @JsonProperty("NumberOfColumns")
    private int numberOfColumns;

    public MultiColumnRegion(RegionModel other) {
        super(other);
    }

    public MultiColumnRegion(String name) throws DxaException {
        super(name);
    }
}
