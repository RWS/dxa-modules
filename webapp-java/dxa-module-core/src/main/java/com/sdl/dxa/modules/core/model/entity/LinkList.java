package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class LinkList extends AbstractEntityModel {

    @JsonProperty("Headline")
    private String headline;

    @JsonProperty("Links")
    private List<Link> links;
}
