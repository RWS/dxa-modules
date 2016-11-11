package com.sdl.dxa.modules.model.TSI811;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.entity.Tag;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class Tsi811TestKeyword extends KeywordModel {

    @JsonProperty("TextField")
    private String textField;

    @JsonProperty("NumberProperty")
    private Double numberProperty;

    @JsonProperty("DateField")
    private Date dateField;

    @JsonProperty("KeywordField")
    private List<Tag> KeywordField;
}
