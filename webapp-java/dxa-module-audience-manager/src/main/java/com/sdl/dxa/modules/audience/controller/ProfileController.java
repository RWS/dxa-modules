package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.validator.LoginFormValidator;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.api.model.entity.RedirectEntity;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(ControllerUtils.INCLUDE_PATH_PREFIX + "AudienceManager/Profile")
public class ProfileController extends EntityController {

    private static final LoginFormValidator LOGIN_FORM_VALIDATOR = new LoginFormValidator();

    @Autowired
    private WebRequestContext webRequestContext;

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        if (model instanceof LoginForm) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            LoginForm loginForm = (LoginForm) (enrichedModel instanceof EntityModel ? enrichedModel : model);

            if (modelBindingRequired(model, request)) {
                loginForm.setBindingResult((BindingResult) request.getAttribute("dataBinding"));
                if (loginForm.getBindingResult() != null && !loginForm.getBindingResult().hasErrors()) {
                    return new RedirectEntity(webRequestContext.getLocalization().getPath());
                }
            }

            return loginForm;
        }

        return model;
    }

    @Override
    protected boolean modelBindingRequired(ViewModel model, HttpServletRequest httpServletRequest) {
        return HttpMethod.POST.name().equals(httpServletRequest.getMethod());
    }

    @Nullable
    @Override
    protected Validator dataBindValidator() {
        return LOGIN_FORM_VALIDATOR;
    }
}
