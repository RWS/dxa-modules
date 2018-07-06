package com.sdl.dxa.modules.ish.controller;

import com.sdl.dxa.modules.ish.exception.IshExceptionHandler;
import com.sdl.dxa.modules.ish.model.ErrorMessage;
import com.sdl.dxa.modules.ish.providers.PublicationService;
import com.sdl.dxa.modules.ish.services.PageService;
import com.sdl.dxa.modules.ish.localization.IshLocalization;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    private static final String ACTIVE_FEATURES = "activeFeatures";
    private static final String CONTENT_IS_EVALUABLE = "contentIsEvaluable";
    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private PageService pageService;

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private IshExceptionHandler exceptionHandler;

    @Value("${active.features}")
    private String activeFeatures;

    @Value("${content.evaluate}")
    private Boolean contentIsEvaluable;

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
            request.setAttribute(PAGE_MODEL, new DefaultPageModel());
        }

        request.setAttribute(LOCALIZATION, localization);
        request.setAttribute(ACTIVE_FEATURES, activeFeatures);
        request.setAttribute(CONTENT_IS_EVALUABLE, contentIsEvaluable);
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
