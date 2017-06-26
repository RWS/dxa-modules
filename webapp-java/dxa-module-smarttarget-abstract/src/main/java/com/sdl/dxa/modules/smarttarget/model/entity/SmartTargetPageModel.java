package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.tridion.smarttarget.query.ExperimentCookie;
import com.tridion.smarttarget.utils.CookieProcessor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@ToString
@Slf4j
public class SmartTargetPageModel extends DefaultPageModel implements PageModel.WithResponseData {

    @Getter
    @Setter
    @Accessors(chain = true)
    @JsonProperty("AllowDuplicates")
    private boolean allowDuplicates;

    @JsonIgnore
    @Setter
    private Map<String, ExperimentCookie> newExperimentCookies;

    public SmartTargetPageModel(PageModel other) {
        super(other);
        if (other instanceof SmartTargetPageModel) {
            SmartTargetPageModel smartTargetPageModel = (SmartTargetPageModel) other;
            this.allowDuplicates = smartTargetPageModel.allowDuplicates;
            if (smartTargetPageModel.newExperimentCookies != null) {
                this.newExperimentCookies = new HashMap<>(smartTargetPageModel.newExperimentCookies);
            }
        }
    }

    @Override
    public PageModel deepCopy() {
        return new SmartTargetPageModel(this);
    }

    @Override
    public boolean setResponseData(HttpServletResponse servletResponse) {
        log.debug("Setting {} to servlet response", newExperimentCookies);
        CookieProcessor.saveExperimentCookies(servletResponse, null, this.newExperimentCookies);
        return true;
    }
}
