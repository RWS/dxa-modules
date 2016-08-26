package com.sdl.ditadelivery.webapp.controllers;

import com.sdl.ditadelivery.webapp.renderers.ReactComponentsRenderer;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.PageNotFoundException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.controller.exception.InternalServerErrorException;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

import static com.sdl.webapp.common.controller.RequestAttributeNames.LOCALIZATION;
import static com.sdl.webapp.common.controller.RequestAttributeNames.PAGE_MODEL;

/**
 * Main controller
 */
@Controller
public class MainController {
    private ReactComponentsRenderer reactComponentsRenderer = new ReactComponentsRenderer();

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private ContentProvider contentProvider;

    /**
     * Home page
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/home")
    public String home(HttpServletRequest request) throws Exception {
        final String requestPath = "/";
        final Localization localization = webRequestContext.getLocalization();

        final PageModel page = getPageModel(requestPath, localization);

        request.setAttribute(PAGE_MODEL, page);
        request.setAttribute(LOCALIZATION, localization);

        return "home";
    }

    /**
     * Home page with server side rendering
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/home-server")
    public String homeServer(HttpServletRequest request) throws Exception {
        final String requestPath = "/";
        final Localization localization = webRequestContext.getLocalization();

        final PageModel page = getPageModel(requestPath, localization);
        request.setAttribute(PAGE_MODEL, page);
        request.setAttribute(LOCALIZATION, localization);

        String homePage = reactComponentsRenderer.renderPage(requestPath);
        request.setAttribute("page", homePage);

        return "home";
    }

    private PageModel getPageModel(String path, Localization localization) {
        try {
            return contentProvider.getPageModel(path, localization);
        } catch (PageNotFoundException e) {
            throw new NotFoundException("Page not found: " + path, e);
        } catch (ContentProviderException e) {
            throw new InternalServerErrorException("An unexpected error occurred", e);
        }
    }

}
