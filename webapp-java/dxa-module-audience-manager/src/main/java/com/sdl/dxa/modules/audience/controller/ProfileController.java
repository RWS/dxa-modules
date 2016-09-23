package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.validator.LoginFormValidator;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
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
            LoginForm loginForm = (LoginForm) model;

            if ("POST".equals(request.getMethod())) {
                bindLoginForm(loginForm, request);

                if (!loginForm.getBindingResult().hasErrors()) {
                    //redirect to index
                }
            }
        }

        return super.enrichModel(model, request);
    }

    private void bindLoginForm(@NotNull LoginForm model, @NotNull HttpServletRequest request) {
        ServletRequestDataBinder dataBinder = new ServletRequestDataBinder(model);
        dataBinder.bind(request);
        dataBinder.setValidator(LOGIN_FORM_VALIDATOR);
        dataBinder.validate();
        model.setBindingResult(dataBinder.getBindingResult());
    }

}
