package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.dxa.modules.docs.mashup.client.*;
import com.sdl.dxa.modules.docs.mashup.models.products.Product;
import com.sdl.dxa.modules.docs.mashup.models.widgets.*;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
        else if(enrichedModel instanceof DynamicWidget) {
            DynamicWidget dynamicWidget = (DynamicWidget) enrichedModel;

            if (validateDynamicWidget(dynamicWidget)) {
                if (tridionDocsClient == null) {
                    tridionDocsClient = new TridionDocsGraphQLClient(this.webRequestContext);
                }

                // There are multiple regions in a page.
                // Each region contains entities and every entity has a view.
                // We are looking for a product entity by its view name which is specified in the dynamicWidget.ProductViewModel .

                for (RegionModel regionModel : this.webRequestContext.getPage().getRegions()) {
                    List<EntityModel> entities = regionModel.getEntities();

                    if (entities != null) {
                        Optional<EntityModel> entity = entities.stream().filter((s) -> s.getMvcData().getViewName().equals(dynamicWidget.getProductViewModel())).findFirst();

                        if (entity.isPresent()) {
                            Product product = (Product) entity.get();

                            if (product != null && product.getKeywords() != null) {
                                // When the product entity is found, we get its keywords.
                                // But we only collect those keywords specified in the dynamicWidget.Keywords .
                                // Then we are ready to get TridionDocs topics by the keywords values .

                                Map<String, KeywordModel> keywords = new HashMap<>();

                                for (Map.Entry<String, KeywordModel> entry : dynamicWidget.getKeywords().entrySet()) {
                                    Optional<Map.Entry<String, KeywordModel>> result = product.getKeywords().entrySet().stream().filter((s) -> s.getKey().contains("." + entry.getKey() + ".")).findFirst();

                                    if (result.isPresent()) {
                                        Map.Entry<String, KeywordModel> keyword = result.get();

                                        if (keyword.getValue() != null && !keywords.containsKey(keyword.getKey())) {
                                            keywords.put(keyword.getKey(), keyword.getValue());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                List<Topic> topics = tridionDocsClient.getTopics(dynamicWidget.getKeywords(), dynamicWidget.getMaxItems());

                dynamicWidget.setTopics(topics);
            }
        }

        return model;
    }

    private Boolean validateStaticWidget(StaticWidget staticWidget) throws ValidationException {
        return validateWidget(staticWidget.getKeywords(), staticWidget.getMaxItems());
    }

    private Boolean validateDynamicWidget(DynamicWidget dynamicWidget) throws ValidationException {
        return validateWidget(dynamicWidget.getKeywords(), dynamicWidget.getMaxItems());
    }

    private Boolean validateWidget(Map<String, KeywordModel> keywords, Integer maxItems) throws ValidationException {
        if (maxItems == null || maxItems < 1) {
            return false;
        }

        if (keywords != null && !keywords.isEmpty()) {

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
