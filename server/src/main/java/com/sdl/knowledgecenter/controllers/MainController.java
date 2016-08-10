package com.sdl.knowledgecenter.controllers;

import com.sdl.knowledgecenter.renderers.ReactComponentsRenderer;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.PageNotFoundException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.controller.exception.InternalServerErrorException;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URL;

import static com.sdl.webapp.common.controller.RequestAttributeNames.LOCALIZATION;
import static com.sdl.webapp.common.controller.RequestAttributeNames.PAGE_MODEL;

@Controller
public class MainController {
    private ReactComponentsRenderer reactComponentsRenderer = new ReactComponentsRenderer();

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private ContentProvider contentProvider;

    @RequestMapping(value = "/home")
    public String home(HttpServletRequest request) throws Exception {
        final String requestPath = "/";
        final Localization localization = webRequestContext.getLocalization();

        final PageModel page = getPageModel(requestPath, localization);

        request.setAttribute(PAGE_MODEL, page);
        request.setAttribute(LOCALIZATION, localization);

        return "home";
    }

    @RequestMapping(value = "/home-server")
    public String homeServer(HttpServletRequest request) throws Exception {
        final String requestPath = "/";
        final Localization localization = webRequestContext.getLocalization();

        final PageModel page = getPageModel(requestPath, localization);
        request.setAttribute(PAGE_MODEL, page);
        request.setAttribute(LOCALIZATION, localization);

        // Use mock for content
        String mockData = "Hello world!";
        String homePage = reactComponentsRenderer.renderPage(requestPath, mockData);
        request.setAttribute("content", mockData);
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
