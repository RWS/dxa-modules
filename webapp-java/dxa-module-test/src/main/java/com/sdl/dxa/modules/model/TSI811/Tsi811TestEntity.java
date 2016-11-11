package com.sdl.dxa.modules.model.TSI811;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class Tsi811TestEntity extends AbstractEntityModel {

    @JsonProperty("Keyword1")
    private List<Tsi811TestKeyword> keyword1;

    @JsonProperty("Keyword2")
    private KeywordModel keyword2;

    @JsonProperty("BooleanProperty")
    private String booleanKeyword;
}
