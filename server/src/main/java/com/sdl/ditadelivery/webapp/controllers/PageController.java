package com.sdl.ditadelivery.webapp.controllers;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.PageNotFoundException;
import com.sdl.webapp.common.api.formats.DataFormatter;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.controller.exception.InternalServerErrorException;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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
@Controller
public class PageController extends com.sdl.webapp.common.controller.PageController {

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private ContentProvider contentProvider;

    @Autowired
    private DataFormatter dataFormatters;

    /**
     * Main entry point of the application
     *
     * @param request
     * @param response
     * @return Redirects to the home page.
     * @throws Exception
     */
    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/", produces = {MediaType.TEXT_HTML_VALUE, MediaType.ALL_VALUE})
    public String handleGetPage(HttpServletRequest request, HttpServletResponse response) throws Exception {
        return "redirect:home";
    }

    /**
     * Get page model using the json format
     *
     * @param request
     * @return Page model using the json format.
     */
    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/api/**",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ModelAndView handleGetPageFormatted(final HttpServletRequest request) {
        // Update path
        final String requestPath = webRequestContext.getRequestPath();
        final String path = requestPath.substring(requestPath.indexOf("/api") + 4);

        final Localization localization = webRequestContext.getLocalization();
        final PageModel page = getPageModel(path, localization);
        this.enrichEmbeddedModels(page, request);
        return dataFormatters.view(page);
    }

    private PageModel getPageModel(String path, Localization localization) {
        // TODO: return json when an exception occurs
        try {
            return contentProvider.getPageModel(path, localization);
        } catch (PageNotFoundException e) {
            throw new NotFoundException("Page not found: " + path, e);
        } catch (ContentProviderException e) {
            throw new InternalServerErrorException("An unexpected error occurred", e);
        }
    }

    /**
     * Enriches all the Region/Entity Models embedded in the given Page Model.
     * Used by <see cref="FormatDataAttribute"/> to get all embedded Models enriched without rendering any Views.
     *
     * @param model   The Page Model to enrich.
     * @param request http request
     */
    private void enrichEmbeddedModels(PageModel model, HttpServletRequest request) {
        if (model == null) {
            return;
        }

        for (RegionModel region : model.getRegions()) {
            // NOTE: Currently not enriching the Region Model itself, because we don't support custom Region Controllers (yet).
            for (int i = 0; i < region.getEntities().size(); i++) {
                EntityModel entity = region.getEntities().get(i);
                if (entity != null && entity.getMvcData() != null) {
                    region.getEntities().set(i, enrichEntityModel(entity, request));
                }
            }
        }
    }

}