package com.sdl.delivery.ish.webapp.controllers;

import com.sdl.delivery.ish.webapp.module.exception.IshExceptionHandler;
import com.sdl.delivery.ish.webapp.module.localization.IshLocalization;
import com.sdl.delivery.ish.webapp.module.model.ErrorMessage;
import com.sdl.delivery.ish.webapp.module.providers.PublicationService;
import com.sdl.delivery.ish.webapp.services.PageService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.page.PageModelImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import static com.sdl.webapp.common.controller.RequestAttributeNames.LOCALIZATION;
import static com.sdl.webapp.common.controller.RequestAttributeNames.PAGE_MODEL;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.isNumeric;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Main controller.
 */
@Controller
public class MainController {

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private PageService pageService;

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private IshExceptionHandler exceptionHandler;

    /**
     * Home page.
     *
     * @param request
     * @return
     */
    @RequestMapping(
            value = {"/home", "/publications/**"},
            method = GET
    )
    public String home(HttpServletRequest request) {
        return getHomeView(null, null, request);
    }


    /**
     * Home page.
     *
     * @param publicationId Publication id
     * @param request
     * @return
     */
    @RequestMapping(
            value = "/{publicationId:[\\d]+}",
            method = GET
    )
    public String home(@PathVariable("publicationId") String publicationId,
                       HttpServletRequest request) {
        return getHomeView(publicationId, null, request);
    }

    /**
     * Home page.
     *
     * @param publicationId Publication id
     * @param pageId        Page id
     * @param request
     * @return
     */
    @RequestMapping(
            value = "/{publicationId:[\\d]+}/{pageId}/**",
            method = GET
    )
    public String home(@PathVariable("publicationId") String publicationId,
                       @PathVariable("pageId") String pageId,
                       HttpServletRequest request) {
        return getHomeView(publicationId, pageId, request);
    }

    private String getHomeView(String publicationId, String pageId, HttpServletRequest request) {
        this.setPageModelOnRequest(publicationId, pageId, request);

        return "home";
    }

    private void setPageModelOnRequest(String publicationId, String pageId, HttpServletRequest request) {
        final IshLocalization localization = (IshLocalization) webRequestContext.getLocalization();

        if (isNotEmpty(publicationId) && isNumeric(publicationId)) {
            localization.setPublicationId(publicationId);
            publicationService.checkPublicationOnline(Integer.parseInt(publicationId));
        }
        if (isNotEmpty(pageId) && isNumeric(pageId)) {
            final PageModel page = pageService.getPageModel(pageId, localization);
            request.setAttribute(PAGE_MODEL, page);
        } else {
            request.setAttribute(PAGE_MODEL, new PageModelImpl());
        }

        request.setAttribute(LOCALIZATION, localization);
    }

    @ExceptionHandler(value = Exception.class)
    ModelAndView handleException(Exception ex) {
        ModelAndView errorPage = new ModelAndView("errorPage");
        ErrorMessage message = exceptionHandler.handleException(ex);

        int httpErrorCode = message.getHttpStatus().value();
        String errorMsg = message.getMessage();

        errorPage.addObject("errorMsg", errorMsg);
        errorPage.addObject("statusCode", httpErrorCode);

        return errorPage;
    }

}
