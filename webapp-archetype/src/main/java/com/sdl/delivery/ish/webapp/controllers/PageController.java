package com.sdl.delivery.ish.webapp.controllers;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Page controller
 * Overwrites DXA page controller to allow custom routing.
 */
@SuppressFBWarnings
@Controller
public class PageController extends com.sdl.webapp.common.controller.PageController {
    /**
     * Main entry point of the application.
     *
     * @param request
     * @param response
     * @return Redirects to the home page.
     * @throws Exception
     */
    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/",
            produces = {MediaType.TEXT_HTML_VALUE, MediaType.ALL_VALUE})
    public String handleGetPage(HttpServletRequest request, HttpServletResponse response) {
        return "redirect:home";
    }

    /**
     * Useless request mapping.
     *
     * @param request
     * @return
     */
    @Override
    @RequestMapping(method = RequestMethod.GET, value = "someunusedreqeustmapping", params = {"format"},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ModelAndView handleGetPageFormatted(final HttpServletRequest request) {
        return new ModelAndView();
    }
}
