package com.sdl.dxa.modules.model.TSI811;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Tsi811PageModel extends DefaultPageModel {

    @JsonProperty("PageKeyword")
    private Tsi811TestKeyword pageKeyword;
}
