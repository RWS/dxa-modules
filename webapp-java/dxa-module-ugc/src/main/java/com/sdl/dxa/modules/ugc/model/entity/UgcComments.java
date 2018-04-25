package com.sdl.dxa.modules.ugc.model.entity;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.tridion.util.CMURI;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class UgcComments extends AbstractEntityModel {

    /**
     * Target CmUri for comments
     **/
    @SemanticMappingIgnore
    private CMURI target;

    /**
     * List of comments
     **/
    @SemanticMappingIgnore
    private List<UgcComment> comments;
}
