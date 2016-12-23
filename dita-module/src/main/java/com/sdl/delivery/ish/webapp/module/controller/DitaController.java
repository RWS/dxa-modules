package com.sdl.delivery.ish.webapp.module.controller;

import com.sdl.delivery.ish.webapp.module.localization.DitaLocalization;
import com.sdl.delivery.ish.webapp.module.model.Topic;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.formats.DataFormatter;
import com.sdl.webapp.common.api.model.PageModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Controller for Dita Module.
 */
@Slf4j
@Controller
public class DitaController {

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private ContentProvider contentProvider;

    @Autowired
    private DataFormatter dataFormatters;


    /**
     * Hello world request mapping.
     */
    @RequestMapping(value = "/api/helloworld", method = GET, produces = "application/json")
    @ResponseBody
    public Topic helloworld() {
        Topic result = new Topic();
        result.setTopicTitle("hello topic");
        return result;
    }


    /**
     * Get page model using the json format.
     *
     * @param request
     * @return Page model using the json format.
     */
    @RequestMapping(method = RequestMethod.GET, value = "/api/page/{publicationId}/{pageId}/**",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ModelAndView getPage(@PathVariable String publicationId,
                                @PathVariable String pageId,
                                final HttpServletRequest request) throws ContentProviderException {
        final DitaLocalization localization = (DitaLocalization) webRequestContext.getLocalization();
        localization.setPublicationId(publicationId);
        final PageModel page;
        page = contentProvider.getPageModel(pageId, localization);
        return dataFormatters.view(page);
    }
}
