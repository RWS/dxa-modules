package com.sdl.dxa.modules.model.CRQ14183;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString(callSuper = true, exclude = {"compLink"})
public class CompLinkTest2 extends AbstractEntityModel {

    @SemanticProperty("compLink")
    public List<Link> compLink;
}
