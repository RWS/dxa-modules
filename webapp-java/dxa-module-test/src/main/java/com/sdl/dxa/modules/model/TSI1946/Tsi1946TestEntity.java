package com.sdl.dxa.modules.model.TSI1946;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.entity.Tag;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@SemanticEntity(entityName = "TSI1946")
public class Tsi1946TestEntity extends AbstractEntityModel {

    @JsonProperty("SingleLineText")
    private String singleLineText;

    @JsonProperty("MultiLineText")
    private String multiLineText;

    @JsonProperty("RichText")
    private RichText richText;

    @JsonProperty("Number")
    private Double number;

    @JsonProperty("Date")
    private DateTime date;

    @JsonProperty("Keyword")
    private Tag keyword;

    @JsonProperty("CompLink")
    private Link compLink;
}
