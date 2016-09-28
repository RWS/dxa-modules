package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.validator.LoginFormValidator;
import com.sdl.dxa.modules.audience.service.SecurityProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.api.model.entity.RedirectEntity;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
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
@Slf4j
public class ProfileController extends EntityController {

    private static final LoginFormValidator LOGIN_FORM_VALIDATOR = new LoginFormValidator();

    private final SecurityProvider securityProvider;

    private final WebRequestContext webRequestContext;

    @Autowired
    public ProfileController(SecurityProvider securityProvider, WebRequestContext webRequestContext) {
        this.securityProvider = securityProvider;
        this.webRequestContext = webRequestContext;
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        if (model instanceof LoginForm) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            LoginForm loginForm = (LoginForm) (enrichedModel instanceof EntityModel ? enrichedModel : model);

            if (modelBindingRequired(model, request)) {
                log.trace("Model binding has been done, processing POST action further");
                return processedWithPostAction(loginForm, request);
            }
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

    @NotNull
    private ViewModel processedWithPostAction(LoginForm loginForm, HttpServletRequest request) {
        loginForm.setBindingResult((BindingResult) request.getAttribute("dataBinding"));
        if (isFormValid(loginForm)) {
            log.trace("Login form is valid, logging in into Audience Manager");

            if (securityProvider.validate(loginForm.getUserName(), loginForm.getPassword())) {
                log.debug("Logged into Audience manager with user name {}", loginForm.getUserName());

                return new RedirectEntity(webRequestContext.getLocalization().getPath());
            } else {
                log.debug("Logging attempt failed because username {} /password combination is not valid", loginForm.getUserName());

                rejectLogin(loginForm, loginForm.getBindingResult(), request);

                return loginForm;
            }
        } else {
            log.debug("Login {} form is not valid, binding result {}", loginForm, loginForm.getBindingResult());
            return loginForm;
        }
    }

    private void rejectLogin(@NotNull LoginForm loginForm, @NotNull BindingResult bindingResult, @NotNull HttpServletRequest request) {
        bindingResult.reject("login.failed", loginForm.getAuthenticationErrorMessage());
        request.setAttribute("bindingResult", bindingResult);
    }

    private boolean isFormValid(LoginForm loginForm) {
        return loginForm.getBindingResult() != null && !loginForm.getBindingResult().hasErrors();
    }
}
