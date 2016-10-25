package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.validator.LoginFormValidator;
import com.sdl.dxa.modules.audience.security.AudienceManagerSecurityProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value = {"/api/profile", "/{path}/api/profile"})
@Slf4j
public class AudienceController {

    private static final String REDIRECT_PREFIX = "redirect:";

    private final AudienceManagerSecurityProvider securityProvider;

    private final WebRequestContext webRequestContext;

    private final LoginFormValidator loginFormValidator;

    @Autowired
    public AudienceController(AudienceManagerSecurityProvider securityProvider, WebRequestContext webRequestContext,
                              LoginFormValidator loginFormValidator) {
        this.securityProvider = securityProvider;
        this.webRequestContext = webRequestContext;
        this.loginFormValidator = loginFormValidator;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@ModelAttribute("entity") LoginForm form, BindingResult bindingResult, RedirectAttributes redirectAttributes,
                        HttpServletRequest request, HttpServletResponse response) {
        loginFormValidator.validate(form, bindingResult);

        if (!bindingResult.hasErrors()) {
            log.trace("Login form is valid, logging in into Audience Manager");

            if (!securityProvider.validate(form, request, response)) {
                log.debug("Logging attempt failed because username {} /password combination is not valid", form.getUserName());
                bindingResult.reject("login.failed", form.getAuthenticationErrorMessage());
            }
        }

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());
            return REDIRECT_PREFIX + form.getLoginFormUrl();
        }

        log.trace("Logged into Audience manager with user name {}", form.getUserName());
        return REDIRECT_PREFIX + webRequestContext.getLocalization().getPath();
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        securityProvider.logout(request, response);
        return REDIRECT_PREFIX + webRequestContext.getLocalization().getPath();
    }
}
