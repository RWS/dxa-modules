package com.sdl.delivery.ish.webapp.module.controller;

import com.sdl.delivery.ish.webapp.module.localization.DitaLocalization;
import com.sdl.delivery.ish.webapp.module.model.Topic;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.formats.DataFormatter;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.controller.AbstractController;
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
public class DitaController extends AbstractController {

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
    public ModelAndView getPublication(@PathVariable String publicationId,
                                       @PathVariable String pageId,
                                       final HttpServletRequest request) {
        final DitaLocalization localization = (DitaLocalization) webRequestContext.getLocalization();
        localization.setPublicationId(publicationId);
        final PageModel page;
        try {
            page = contentProvider.getPageModel(pageId, localization);
            this.enrichEmbeddedModels(page, request);
            return dataFormatters.view(page);
        } catch (ContentProviderException e) {
            log.error("Unable to get page model.", e);
        }
        return null;
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
            // NOTE: Currently not enriching the Region Model itself, because we don't support custom Region
            // Controllers (yet).
            for (int i = 0; i < region.getEntities().size(); i++) {
                EntityModel entity = region.getEntities().get(i);
                if (entity != null && entity.getMvcData() != null) {
                    region.getEntities().set(i, enrichEntityModel(entity, request));
                }
            }
        }
    }

}
