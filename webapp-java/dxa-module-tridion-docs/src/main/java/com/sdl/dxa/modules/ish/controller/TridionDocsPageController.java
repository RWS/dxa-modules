package com.sdl.dxa.modules.ish.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Page controller
 * Overwrites DXA page controller to allow custom routing.
 */
@Controller
public class TridionDocsPageController {
    /**
     * Main entry point of the application.
     *
     * @param request
     * @param response
     * @return Redirects to the home page.
     * @throws Exception if client response is broken
     */
    @RequestMapping(method = RequestMethod.GET, value = "/ish/",
            produces = {MediaType.TEXT_HTML_VALUE, MediaType.ALL_VALUE})
    public String handleGetPage(HttpServletRequest request, HttpServletResponse response) {
        return "redirect:home";
    }
}
