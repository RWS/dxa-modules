package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.page.AbstractPageModelImpl;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@ToString
public abstract class AbstractSmartTargetPageModel extends AbstractPageModelImpl implements PageModel.WithResponseData {

    @Getter
    @Setter
    @Accessors(chain = true)
    @JsonProperty("AllowDuplicates")
    private boolean allowDuplicates;

    AbstractSmartTargetPageModel(PageModel pageModel) {
        super(pageModel);
    }
}
