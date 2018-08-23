package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.*;
import com.sdl.dxa.modules.docs.mashup.models.widgets.*;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.ValidationException;

@Controller
@RequestMapping(ControllerUtils.INCLUDE_PATH_PREFIX + "TridionDocsMashup/TridionDocsMashup")
@Slf4j
public class TridionDocsMashupController extends EntityController {

    private final WebRequestContext webRequestContext;
    private ITridionDocsClient tridionDocsClient;

    @Autowired
    public TridionDocsMashupController(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    // Used only by Unit Tests to pass a mocked WebRequestContext and a mocked ITridionDocsClient
    public TridionDocsMashupController(WebRequestContext webRequestContext, ITridionDocsClient tridionDocsClient) {
        this.webRequestContext = webRequestContext;
        this.tridionDocsClient = tridionDocsClient;
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        final ViewModel enrichedModel = super.enrichModel(model, request);

        if (enrichedModel instanceof StaticWidget) {
            StaticWidget staticWidget = (StaticWidget) enrichedModel;

            if (validateStaticWidget(staticWidget)) {
                if (tridionDocsClient == null) {
                    tridionDocsClient = new TridionDocsGraphQLClient(this.webRequestContext);
                }

                List<Topic> topics = tridionDocsClient.getTopics(staticWidget.getKeywords(), staticWidget.getMaxItems());

                staticWidget.setTopics(topics);
            }
        }

        return model;
    }

    private Boolean validateStaticWidget(StaticWidget staticWidget) throws ValidationException {
        Integer maxItems = staticWidget.getMaxItems();
        Map<String, KeywordModel> keywords = staticWidget.getKeywords();

        if (maxItems == null || maxItems < 1) {
            return false;
        }

        if (keywords == null || keywords.size() < 1) {
            throw new ValidationException("Keyword list must have at least one keyword.");
        }
        else {
            for (Map.Entry<String, KeywordModel> entry : keywords.entrySet()) {
                String[] keywordFiledXmlName = entry.getKey().split(Pattern.quote("."));

                if (keywordFiledXmlName.length != 3) {
                    throw new ValidationException("Keyword key must be in the format SCOPE.KEYWORDNAME.FIELDTYPE (e.g. Item.FMBCONTENTREFTYPE.logical).");
                }
            }
        }

        return true;
    }
}
