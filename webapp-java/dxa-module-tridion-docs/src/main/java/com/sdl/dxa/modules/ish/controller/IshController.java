package com.sdl.dxa.modules.ish.controller;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import com.sdl.dxa.modules.docs.exception.DocsExceptionHandler;
import com.sdl.dxa.modules.docs.model.ErrorMessage;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.dxa.modules.ish.providers.ConditionService;
import com.sdl.dxa.modules.ish.providers.PublicationService;
import com.sdl.dxa.modules.ish.providers.TocService;
import com.sdl.dxa.modules.ish.providers.TridionDocsContentService;
import com.sdl.dxa.modules.ish.utils.ConditionUtil;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.ContentProvider_22;
import com.sdl.webapp.common.api.content.StaticContentItem;
import com.sdl.webapp.common.api.formats.DataFormatter;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import com.sdl.webapp.common.util.MimeUtils;
import com.tridion.meta.Item;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServletServerHttpResponse;
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
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private static final URI USER_CONDITIONS_URI = URI.create("taf:ish:userconditions:merged");

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private DataFormatter dataFormatters;

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private DocsExceptionHandler exceptionHandler;

    @Autowired
    private TocService tocService;

    @Autowired
    private TridionDocsContentService tridionDocsContentService;

    @Autowired
    private ConditionService conditionService;

    @Autowired
    private ContentProvider_22 contentProvider;

    //Don't use an @Autowired objectmapper here, we need to change some configuration.
    private ObjectMapper objectMapper = new ObjectMapper();

    public IshController() {
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    }

    /**
     * Get page model using the json format.
     *
     * @param publicationId Publication id
     * @param pageId        Page id
     * @param request       Http request
     * @param response      Http response
     * @return Page model using the json format.
     * @throws ContentProviderException if page model cannot be fetched
     */
    @RequestMapping(method = {GET, POST}, value = "/api/page/{publicationId}/{pageId}/**",
            produces = {APPLICATION_JSON_VALUE})
    public ModelAndView getPage(@PathVariable Integer publicationId,
                                @PathVariable Integer pageId,
                                @RequestParam(value = "conditions", defaultValue = "") String conditions,
                                final HttpServletRequest request,
                                final HttpServletResponse response) throws ContentProviderException, IOException {
        final Localization localization = webRequestContext.getLocalization();
        publicationService.checkPublicationOnline(publicationId, localization);
        if (!conditions.isEmpty()) {
            String mergedConditions = getMergedConditions(conditions, publicationId);
            ConditionUtil.addConditions(USER_CONDITIONS_URI, mergedConditions);
        }
        PageModel page = contentProvider.getPageModel(pageId, localization);
        if (page == null) {
            response.setStatus(NOT_FOUND.value());
            throw new ResourceNotFoundException("Page not found: [" + localization.getId() + "] " + pageId + "/index.html");
        }
        return dataFormatters.view(page);
    }

    /**
     * Get binary data.
     *
     * @param publicationId Publication id
     * @param binaryId      Binary id
     * @return Binary data using a stream.
     * @throws ContentProviderException if page model cannot be fetched
     * @throws IOException if something wrong with tomcat response channel
     */
    @RequestMapping(method = GET, value = "/binary/{publicationId}/{binaryId}/**",
            produces = MediaType.ALL_VALUE)
    @ResponseBody
    public void getBinaryResource(HttpServletResponse response, @PathVariable Integer publicationId,
                                  @PathVariable String binaryId) throws ContentProviderException, IOException {
        publicationService.checkPublicationOnline(publicationId, webRequestContext.getLocalization());
        int binaryIdInt = -1;
        try {
            binaryIdInt = Integer.parseInt(binaryId);
        } catch (NumberFormatException e) {
            throw new ContentProviderException("Invalid request");
        }

        try (final ServletServerHttpResponse res = new ServletServerHttpResponse(response)) {
            Localization localization = webRequestContext.getLocalization();
            StaticContentItem content = contentProvider.getStaticContent(binaryIdInt, localization);
            String mimeType = MimeUtils.getMimeType("file" + content.getContentType());
            response.setHeader("content-type", mimeType);

            try (final InputStream in = content.getContent();
                 final OutputStream out = res.getBody()) {
                IOUtils.copy(in, out);
            }
        }
    }

    /**
     * Get list of publications using the json format.
     *
     * @return Publications list using the json format.
     * @throws IshServiceException if publications cannot be fetched
     */
    @RequestMapping(method = GET, value = "/api/publications", produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public List<Publication> getPublicationList() throws IshServiceException {
        return publicationService.getPublicationList(webRequestContext.getLocalization());
    }

    @RequestMapping(method = {GET, POST}, value = "/api/toc/{publicationId}", produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public Collection<SitemapItem> getRootToc(@PathVariable("publicationId") Integer publicationId,
                                              @RequestParam(value = "conditions", defaultValue = "") String conditions,
                                              HttpServletRequest request) throws ContentProviderException, IOException {
        publicationService.checkPublicationOnline(publicationId, webRequestContext.getLocalization());
        if (!conditions.isEmpty()) {
            String mergedConditions = getMergedConditions(conditions, publicationId);
            ConditionUtil.addConditions(USER_CONDITIONS_URI, mergedConditions);
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
                                          HttpServletRequest request) throws ContentProviderException, IOException {
        publicationService.checkPublicationOnline(publicationId, webRequestContext.getLocalization());
        if (!conditions.isEmpty()) {
            String mergedConditions = getMergedConditions(conditions, publicationId);
            ConditionUtil.addConditions(USER_CONDITIONS_URI, mergedConditions);
        }
        return tocService.getToc(publicationId, sitemapItemId, includeAncestors, 1, request,
                webRequestContext);
    }

    @RequestMapping(method = GET, value = "/api/conditions/{publicationId:[\\d]+}", produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public String getPublicationConditions(@PathVariable("publicationId") Integer publicationId) {
        return conditionService.getConditions(publicationId, webRequestContext.getLocalization());
    }

    /** * Get page model using the json format by given criteria.
     * As a criteria you may use any metadata field with given value.
     * It looks for page in given publication which meets criteria
     *
     * @param publicationId target Publication id where we have to fetch Page Id (aka topic id)
     * @param ishFieldValue Value of meta field 'ishlogicalref.object.id'
     *                      which is reference number of topic. This reference is common for a topic,
     *                      which is used in different publications
     * @return Integer pageId of a topic in target publication
     * @throws ContentProviderException if topic cannot be fetched
     */
    @RequestMapping(method = {GET, POST}, value = "/api/pageIdByReference/{publicationId}/{ishFieldValue}",
            produces = {APPLICATION_JSON_VALUE})
    @ResponseBody
    public Item getTopicIdInTargetPublication(@PathVariable("publicationId") Integer publicationId,
                                              @PathVariable("ishFieldValue") String ishFieldValue)
            throws ContentProviderException {
        publicationService.checkPublicationOnline(publicationId, webRequestContext.getLocalization());
        if (Strings.isNullOrEmpty(ishFieldValue)) {
            throw new NotFoundException("Unable to use empty 'ishlogicalref.object.id' value as a search criteria");
        }
        return tridionDocsContentService.getPageIdByIshLogicalReference(publicationId, ishFieldValue);
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    ResponseEntity<ErrorMessage> handleException(Exception ex) {
        ErrorMessage message = exceptionHandler.handleException(ex);
        return new ResponseEntity(message, message.getHttpStatus());
    }

    @ResponseStatus(value = NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    private String getMergedConditions(String conditions, int publicationId) throws IOException, DxaItemNotFoundException {
        if (conditions == null) {
            return null;
        }
        Map conditionsMap = objectMapper.readValue(conditions, Map.class);
        Map<String, List> userConditions = (Map<String, List>) conditionsMap.get("userConditions");
        Map<String, List> result = new HashMap<>();

        if (userConditions != null && !userConditions.isEmpty()) {
            Localization localization = webRequestContext.getLocalization();
            Map<String, Map> systemConditions = conditionService.getObjectConditions(publicationId, localization);
            for (Map.Entry<String, Map> entry : systemConditions.entrySet()) {
                Object[] values = (Object[]) entry.getValue().get("values");
                if (values == null) {
                    result.put(entry.getKey(), null);
                } else {
                    result.put(entry.getKey(), Arrays.asList(values));
                }
            }

            //Overwrite system conditions with the userconditions:
            for (Map.Entry<String, List> entry : userConditions.entrySet()) {
                result.put(entry.getKey(), entry.getValue());
            }
        }

        return objectMapper.writeValueAsString(result);
    }

}
