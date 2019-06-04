package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.caching.NoOutputCache;
import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(ControllerUtils.INCLUDE_PATH_PREFIX + "AudienceManager/Profile")
@Slf4j
@NoOutputCache
public class ProfileController extends EntityController {

    private final WebRequestContext webRequestContext;

    @Autowired
    public ProfileController(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        if (model instanceof LoginForm) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            LoginForm loginForm = (LoginForm) (enrichedModel instanceof EntityModel ? enrichedModel : model);

            loginForm.setLoginFormUrl(webRequestContext.getPage().getUrl());
        }

        return model;
    }
}
