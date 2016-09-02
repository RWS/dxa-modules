package com.sdl.ditadelivery.webapp.controllers;

import com.sdl.ditadelivery.webapp.renderers.ReactComponentsRenderer;
import com.sdl.ditadelivery.webapp.services.PageService;
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
import org.springframework.web.bind.annotation.*;

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
    private PageService pageService;

    /**
     * Home page (default)
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/home", method = RequestMethod.GET)
    public String home(HttpServletRequest request) throws Exception {

        this.setPageModelOnRequest(request);

        return "home";
    }

    /**
     * Home page (with context)
     *
     * @param publicationId Publication id
     * @param sitemapItemId Sitemap item id
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(
            value = "/{publicationid:^ish:[0-9]+-[0-9]+-[0-9]+$}/{sitemapitemid:^ish:[0-9]+-[0-9]+-[0-9]+$}/**",
            method = RequestMethod.GET
    )
    public String home(@PathVariable("publicationid") String publicationId,
                       @PathVariable("sitemapitemid") String sitemapItemId,
                       HttpServletRequest request) throws Exception {

        this.setPageModelOnRequest(request);

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
        this.setPageModelOnRequest(request);

        String homePage = reactComponentsRenderer.renderPage("/");
        request.setAttribute("page", homePage);

        return "home";
    }

    private void setPageModelOnRequest(HttpServletRequest request) {
        final String requestPath = "/";
        final Localization localization = webRequestContext.getLocalization();

        final PageModel page = pageService.getPageModel(requestPath, localization);

        request.setAttribute(PAGE_MODEL, page);
        request.setAttribute(LOCALIZATION, localization);
    }

}
