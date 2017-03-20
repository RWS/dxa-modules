package com.sdl.dxa.modules.model.TSI2315;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;

import java.util.List;

@Data
public class CompLinkTest extends AbstractEntityModel {

    @SemanticProperty("compLink")
    public List<EntityModel> compLinkAsEntityModel;

    @SemanticProperty("compLink")
    public List<String> compLinkAsString;

    @SemanticProperty("compLink")
    public List<Link> compLinkAsLink;
}
