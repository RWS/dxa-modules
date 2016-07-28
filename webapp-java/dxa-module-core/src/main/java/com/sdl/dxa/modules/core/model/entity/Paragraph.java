package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.MediaItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Paragraph extends AbstractEntityModel {

    @JsonProperty("Subheading")
    private String subheading;

    @JsonProperty("Content")
    private RichText content;

    @JsonProperty("Media")
    private MediaItem media;

    @JsonProperty("Caption")
    private String caption;
}
