package com.sdl.dxa.modules.docs.mashup.controller;

import com.sdl.webapp.common.impl.localization.DocsLocalization;;
import com.sdl.dxa.modules.docs.mashup.client.TridionDocsClient;
import com.sdl.dxa.modules.docs.mashup.exception.DocsMashupException;
import com.sdl.dxa.modules.docs.mashup.models.products.Product;
import com.sdl.dxa.modules.docs.mashup.models.widgets.DynamicWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.StaticWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.Dxa22ContentProvider;
import com.sdl.webapp.common.api.content.StaticContentItem;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import com.sdl.webapp.common.util.MimeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping(value={ControllerUtils.INCLUDE_PATH_PREFIX + "TridionDocsMashup/TridionDocsMashup" , "/docsmashup"})
@Slf4j
@Profile("!cil.providers.active")
public class TridionDocsMashupController extends EntityController {

    private final WebRequestContext webRequestContext;
    private final Dxa22ContentProvider contentProvider;
    private final TridionDocsClient tridionDocsClient;

    @Autowired
    public TridionDocsMashupController(WebRequestContext webRequestContext, Dxa22ContentProvider contentProvider, TridionDocsClient tridionDocsClient) {
        this.webRequestContext = webRequestContext;
        this.contentProvider = contentProvider;
        this.tridionDocsClient = tridionDocsClient;
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        final ViewModel enrichedModel = super.enrichModel(model, request);

        if (enrichedModel instanceof StaticWidget) {
            StaticWidget staticWidget = (StaticWidget) enrichedModel;
            if (validate(staticWidget.getKeywords(), staticWidget.getMaxItems())) {
                List<Topic> topics = tridionDocsClient.getTopicsByKeywords(staticWidget.getKeywords(), staticWidget.getMaxItems());
                staticWidget.setTopics(topics);
            }
        } else if (enrichedModel instanceof DynamicWidget) {
            DynamicWidget dynamicWidget = (DynamicWidget) enrichedModel;

            List<Topic> topics = new ArrayList<>();

            // There are multiple regions in a page.
            // Each region contains entities and every entity has a view.
            // We are looking for a product entity by its view name which is specified in the dynamicWidget.ProductViewModel .
            for (RegionModel regionModel : this.webRequestContext.getPage().getRegions()) {
                List<EntityModel> entities = regionModel.getEntities();
                if (entities == null) {
                    continue;
                }
                Optional<EntityModel> entity = entities
                        .stream()
                        .filter(s -> s.getMvcData().getViewName().equals(dynamicWidget.getProductViewModel()))
                        .findFirst();
                if (!entity.isPresent()) {
                    continue;
                }
                Product product = (Product) entity.get();

                if (product.getKeywords() != null) {
                    // When the product entity is found, we get its keywords.
                    // But we only collect those keywords specified in the dynamicWidget.Keywords .
                    // Then we are ready to get TridionDocs topics by the keywords values .

                    topics = getTopics(dynamicWidget, topics, product);

                    break;
                }
            }
            dynamicWidget.setTopics(topics);
        }
        return model;
    }

    private List<Topic> getTopics(DynamicWidget dynamicWidget, List<Topic> topics, Product product) throws ValidationException, DocsMashupException {
        if (!validate(product.getKeywords(), dynamicWidget.getMaxItems())) {
            return topics;
        }
        Map<String, KeywordModel> keywords = new HashMap<>();
        for (String entry : dynamicWidget.getKeywords()) {
            Optional<Map.Entry<String, KeywordModel>> result = product.getKeywords().entrySet()
                    .stream()
                    .filter(s -> s.getKey().contains("." + entry + "."))
                    .findFirst();
            if (!result.isPresent()) {
                continue;
            }
            Map.Entry<String, KeywordModel> keyword = result.get();
            if (keyword.getValue() != null && !keywords.containsKey(keyword.getKey())) {
                keywords.put(keyword.getKey(), keyword.getValue());
            }
        }
        if (!keywords.isEmpty()) {
            topics = tridionDocsClient.getTopicsByKeywords(keywords, dynamicWidget.getMaxItems());
        }
        return topics;
    }

    /**
     * Get binary data.
     *
     * @param publicationId Publication id
     * @param binaryId      Binary id
     * @return Binary data using a stream.
     * @throws ContentProviderException if page model cannot be fetched
     * @throws IOException              if something wrong with tomcat response channel
     */
     @RequestMapping(method = GET, value ="/binary/{publicationId}/{binaryId}/**" ,produces = MediaType.ALL_VALUE)
    @ResponseBody
    public ResponseEntity<InputStreamResource> getBinaryResource(@PathVariable Integer publicationId,
                                                                 @PathVariable Integer binaryId)
            throws ContentProviderException, IOException {

        HttpHeaders responseHeaders = new HttpHeaders();
        DocsLocalization docsLocalization = new DocsLocalization();
        docsLocalization.setPublicationId(String.valueOf(publicationId));
        StaticContentItem binaryItem = contentProvider.getStaticContent(binaryId, docsLocalization);
        if (binaryItem == null) {
            return new ResponseEntity<>(null, responseHeaders, HttpStatus.NOT_FOUND);
        }
        InputStreamResource result = new InputStreamResource(binaryItem.getContent());

        String type = binaryItem.getContentType();
        String mimeType = null;

        if(!type.startsWith(".")) {
            mimeType = type;
        } else {
            type = type.substring(1); // remove dot symbol on the start
            mimeType = MimeUtils.getMimeType(type);
        }

        responseHeaders.setContentType(MediaType.parseMediaType(mimeType));
        responseHeaders.setContentLength(binaryItem.getContent().available());

        return new ResponseEntity<>(result, responseHeaders, HttpStatus.OK);
    }

    private Boolean validate(Map<String, KeywordModel> keywords, Integer maxItems) throws ValidationException {
        if (maxItems == null || maxItems < 1) {
            return false;
        }
        if (keywords == null || keywords.isEmpty()) {
            return true;
        }
        for (Map.Entry<String, KeywordModel> entry : keywords.entrySet()) {
            String[] keywordFilledXmlName = entry.getKey().split(Pattern.quote("."));

            if (keywordFilledXmlName.length != 3) {
                throw new ValidationException("Keyword key must be in the format SCOPE.KEYWORDNAME.FIELDTYPE (e.g. Item.FMBCONTENTREFTYPE.logical).");
            }
        }
        return true;
    }
}