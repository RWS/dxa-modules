package com.sdl.dxa.modules.ish.controller;

import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.services.SitemapService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.controller.exception.DocsExceptionHandler;
import com.sdl.webapp.common.impl.model.ErrorMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

/**
 * Sitemap controller.
 */
@Controller
public class SitemapController {
    @Autowired
    private DocsExceptionHandler exceptionHandler;

    @Autowired
    private SitemapService sitemapService;

    @Autowired
    private WebRequestContext webRequestContext;

    @RequestMapping(value = "/api/sitemap.xml", produces = APPLICATION_XML_VALUE)
    @ResponseBody
    public String create(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType(MediaType.APPLICATION_XML_VALUE);

        String contextPath = StringUtils.substringBefore(request.getRequestURL().toString(),
                request.getServletPath()) + "/";

        return sitemapService.createSitemap(contextPath, webRequestContext.getLocalization());
    }

    @ExceptionHandler(value = {Exception.class, IshServiceException.class})
    @ResponseBody
    ResponseEntity<ErrorMessage> handleException(Exception ex) {
        ErrorMessage message = exceptionHandler.handleException(ex);
        return new ResponseEntity<>(message, message.getHttpStatus());
    }
}
