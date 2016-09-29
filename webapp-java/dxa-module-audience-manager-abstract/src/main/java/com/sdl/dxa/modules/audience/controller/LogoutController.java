package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.service.SecurityProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = {"/api/profile/logout", "/{path}/api/profile/logout"})
public class LogoutController {

    private final SecurityProvider securityProvider;

    private final WebRequestContext webRequestContext;

    @Autowired
    public LogoutController(SecurityProvider securityProvider, WebRequestContext webRequestContext) {
        this.securityProvider = securityProvider;
        this.webRequestContext = webRequestContext;
    }

    @RequestMapping
    public String logout() {
        securityProvider.logout();
        return "redirect:" + webRequestContext.getLocalization().getPath();
    }
}
