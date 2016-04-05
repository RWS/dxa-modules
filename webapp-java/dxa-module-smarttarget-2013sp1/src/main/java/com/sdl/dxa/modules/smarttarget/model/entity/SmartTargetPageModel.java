package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sdl.webapp.common.api.model.PageModel;
import com.tridion.smarttarget.query.ExperimentCookie;
import com.tridion.smarttarget.utils.CookieProcessor;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Slf4j
@EqualsAndHashCode(callSuper = true)
@ToString
public class SmartTargetPageModel extends AbstractSmartTargetPageModel {

    @JsonIgnore
    @Setter
    private Map<String, ExperimentCookie> newExperimentCookies;

    public SmartTargetPageModel(PageModel pageModel) {
        super(pageModel);
    }

    @Override
    public boolean setResponseData(HttpServletResponse servletResponse) {
        log.debug("Setting {} to servlet response", newExperimentCookies);
        CookieProcessor.saveExperimentCookies(servletResponse, null, this.newExperimentCookies);
        return true;
    }
}
