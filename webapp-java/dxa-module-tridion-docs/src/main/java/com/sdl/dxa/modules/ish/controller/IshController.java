package com.sdl.dxa.modules.ish.controller;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.google.common.base.Strings;
import com.sdl.dxa.modules.ish.exception.IshExceptionHandler;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.ErrorMessage;
import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.dxa.modules.ish.providers.PublicationService;
import com.sdl.dxa.modules.ish.providers.TocService;
import com.sdl.dxa.modules.ish.localization.IshLocalization;
import com.sdl.dxa.modules.ish.providers.ConditionService;
import com.sdl.dxa.modules.ish.providers.TridionDocsContentService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.StaticContentItem;
import com.sdl.webapp.common.api.formats.DataFormatter;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.tridion.ambientdata.web.WebContext;
import com.tridion.meta.Item;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Controller for Ish Module.
 */
@Slf4j
@Controller
public class IshController {
    private static final URI USER_CONDITIONS_URI = URI.create("taf:ish:userconditions");

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private DataFormatter dataFormatters;

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private IshExceptionHandler exceptionHandler;

    @Autowired
    private TocService tocService;

    @Autowired
    private TridionDocsContentService tridionDocsContentService;

    @Autowired
    private ConditionService conditionService;

    /**
     * Get page model using the json format.
     *
     * @param publicationId Publication id
     * @param pageId        Page id
     * @param request       Http request
     * @return Page model using the json format.
     * @throws ContentProviderException
     */
    @RequestMapping(method = {GET, POST}, value = "/api/page/{publicationId}/{pageId}/**",
            produces = {APPLICATION_JSON_VALUE})
    public ModelAndView getPage(@PathVariable Integer publicationId,
                                @PathVariable Integer pageId,
                                @RequestParam(value = "conditions", defaultValue = "") String conditions,
                                final HttpServletRequest request,
                                final HttpServletResponse response) throws ContentProviderException {
        publicationService.checkPublicationOnline(publicationId);
        final IshLocalization localization = (IshLocalization) webRequestContext.getLocalization();
        localization.setPublicationId(Integer.toString(publicationId));
        if (!conditions.isEmpty()) {
            WebContext.getCurrentClaimStore().put(USER_CONDITIONS_URI, conditions);
        }
        PageModel page = tridionDocsContentService.getPageModel(pageId, localization, request.getContextPath());
        if (page == null) {
            response.setStatus(NOT_FOUND.value());
            throw new ResourceNotFoundException("Page not found: [" + localization.getId() + "] " + pageId + "/index.html");
        }
        return dataFormatters.view(page);
    }

    @ResponseStatus(value = NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    /**
     * Get binary data.
     *
     * @param publicationId Publication id
     * @param binaryId      Binary id
     * @return Binary data using a stream.
     * @throws ContentProviderException
     * @throws IOException
     */
    @RequestMapping(method = GET, value = "/binary/{publicationId}/{binaryId}/**",
            produces = MediaType.ALL_VALUE)
    @ResponseBody
    public ResponseEntity<InputStreamResource> getBinaryResource(@PathVariable Integer publicationId,
                                                                 @PathVariable Integer binaryId)
            throws ContentProviderException, IOException {
        publicationService.checkPublicationOnline(publicationId);
        StaticContentItem binaryItem = tridionDocsContentService.getBinaryContent(publicationId, binaryId);
        InputStreamResource result = new InputStreamResource(binaryItem.getContent());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(binaryItem.getContentType()));
        headers.setContentLength(binaryItem.getContent().available());

        return new ResponseEntity<>(result, headers, HttpStatus.OK);
    }

    /**
     * Get list of publications using the json format.
     *
     * @return Publications list using the json format.
     * @throws IshServiceException
     */
    @RequestMapping(method = GET, value = "/api/publications", produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public List<Publication> getPublicationList() throws IshServiceException {
        return publicationService.getPublicationList();
    }

    @RequestMapping(method = {GET, POST}, value = "/api/toc/{publicationId}", produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public Collection<SitemapItem> getRootToc(@PathVariable("publicationId") Integer publicationId,
                                              @RequestParam(value = "conditions", defaultValue = "") String conditions,
                                              HttpServletRequest request) {
        publicationService.checkPublicationOnline(publicationId);
        if (!conditions.isEmpty()) {
            WebContext.getCurrentClaimStore().put(USER_CONDITIONS_URI, conditions);
        }
        return tocService.getToc(publicationId, null, false, 1, request, webRequestContext);
    }

    @RequestMapping(method = {GET, POST}, value = "/api/toc/{publicationId}/{sitemapItemId}",
            produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public Collection<SitemapItem> getToc(@PathVariable("publicationId") Integer publicationId,
                                          @PathVariable("sitemapItemId") String sitemapItemId,
                                          @RequestParam(value = "includeAncestors", required = false,
                                                  defaultValue = "false") boolean includeAncestors,
                                          @RequestParam(value = "conditions", defaultValue = "") String conditions,
                                          HttpServletRequest request) {
        publicationService.checkPublicationOnline(publicationId);
        if (!conditions.isEmpty()) {
            WebContext.getCurrentClaimStore().put(USER_CONDITIONS_URI, conditions);
        }
        return tocService.getToc(publicationId, sitemapItemId, includeAncestors, 1, request,
                webRequestContext);
    }

    @RequestMapping(method = GET, value = "/api/conditions/{publicationId:[\\d]+}", produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public String getPublicationConditions(@PathVariable("publicationId") Integer publicationId) {
        return conditionService.getConditions(publicationId).toString();
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    ResponseEntity<ErrorMessage> handleException(Exception ex) {
        ErrorMessage message = exceptionHandler.handleException(ex);
        return new ResponseEntity(message, message.getHttpStatus());
    }

    /**
     * Get page model using the json format by given criteria.
     * As a criteria you may use any metadata field with given value.
     * It looks for page in given publication which meets criteria
     *
     * @param publicationId target Publication id where we have to fetch Page Id (aka topic id)
     * @param ishFieldValue Value of meta field 'ishlogicalref.object.id'
     *                      which is reference number of topic. This reference is common for a topic,
     *                      which is used in different publications
     * @return Integer pageId of a topic in target publication
     * @throws ContentProviderException
     */
    @RequestMapping(method = {GET, POST}, value = "/api/pageIdByReference/{publicationId}/{ishFieldValue}",
            produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public Item getTopicIdInTargetPublication(@PathVariable("publicationId") Integer publicationId,
                                              @PathVariable("ishFieldValue") String ishFieldValue)
            throws ContentProviderException {
        publicationService.checkPublicationOnline(publicationId);
        if (Strings.isNullOrEmpty(ishFieldValue)) {
            throw new NotFoundException("Unable to use empty 'ishlogicalref.object.id' value as a search criteria");
        }
        return tridionDocsContentService.getPageIdByIshLogicalReference(publicationId, ishFieldValue);
    }
}
