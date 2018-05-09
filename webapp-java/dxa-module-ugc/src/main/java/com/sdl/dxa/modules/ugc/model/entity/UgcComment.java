package com.sdl.dxa.modules.ugc.model.entity;

import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * <p>EntityModel for a single Ugc comment</p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UgcComment extends AbstractEntityModel {

    /**
     * Comment Data
     **/
    private Comment commentData;

    /**
     * List of related comments
     **/
    private List<UgcComment> comments;

}
