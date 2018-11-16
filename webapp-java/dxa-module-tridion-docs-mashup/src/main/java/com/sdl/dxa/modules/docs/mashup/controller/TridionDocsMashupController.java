package com.sdl.dxa.modules.docs.mashup.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.docs.localization.DocsLocalization;
import com.sdl.dxa.modules.docs.mashup.client.*;
import com.sdl.dxa.modules.docs.mashup.models.products.Product;
import com.sdl.dxa.modules.docs.mashup.models.widgets.*;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.StaticContentItem;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import java.io.IOException;

import java.util.*;
import java.util.regex.Pattern;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.ValidationException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value={ControllerUtils.INCLUDE_PATH_PREFIX + "TridionDocsMashup/TridionDocsMashup" , "/docsmashup"})
@Slf4j
public class TridionDocsMashupController extends EntityController {

    private final WebRequestContext webRequestContext;
    private final ContentProvider contentProvider;
    private ITridionDocsClient tridionDocsClient;

    @Autowired
    public TridionDocsMashupController(WebRequestContext webRequestContext, ApiClientProvider apiClientProvider, ContentProvider contentProvider, ObjectMapper objectMapper) {
        this.webRequestContext = webRequestContext;
        this.contentProvider = contentProvider;
        
        this.tridionDocsClient = new TridionDocsPublicContentApiClient(this.webRequestContext, apiClientProvider.getClient(), objectMapper);
    }

    // Used only by Unit Tests to pass a mocked WebRequestContext and a mocked ITridionDocsClient
    public TridionDocsMashupController(WebRequestContext webRequestContext, ApiClientProvider pcaClientProvider, ContentProvider contentProvider, ObjectMapper objectMapper, ITridionDocsClient tridionDocsClient) {
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

                if (entities != null) {
                    Optional<EntityModel> entity = entities.stream().filter((s) -> s.getMvcData().getViewName().equals(dynamicWidget.getProductViewModel())).findFirst();

                    if (entity.isPresent()) {
                        Product product = (Product) entity.get();

                        if (product != null && product.getKeywords() != null) {
                            // When the product entity is found, we get its keywords.
                            // But we only collect those keywords specified in the dynamicWidget.Keywords .
                            // Then we are ready to get TridionDocs topics by the keywords values .

                            if (validate(product.getKeywords(), dynamicWidget.getMaxItems())) {
                                Map<String, KeywordModel> keywords = new HashMap<>();

                                for (String entry : dynamicWidget.getKeywords()) {
                                    Optional<Map.Entry<String, KeywordModel>> result = product.getKeywords().entrySet().stream().filter((s) -> s.getKey().contains("." + entry + ".")).findFirst();

                                    if (result.isPresent()) {
                                        Map.Entry<String, KeywordModel> keyword = result.get();

                                        if (keyword.getValue() != null && !keywords.containsKey(keyword.getKey())) {
                                            keywords.put(keyword.getKey(), keyword.getValue());
                                        }
                                    }
                                }

                                if (!keywords.isEmpty()) {
                                    topics = tridionDocsClient.getTopicsByKeywords(keywords, dynamicWidget.getMaxItems());
                                }
                            }

                            break;
                        }
                    }
                }
            }

            dynamicWidget.setTopics(topics);
        }

        return model;
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
     @RequestMapping(method = GET, value ="/binary/{publicationId}/{binaryId}/**" ,produces = MediaType.ALL_VALUE)
    @ResponseBody
    public ResponseEntity<InputStreamResource> getBinaryResource(@PathVariable Integer publicationId,
                                                                 @PathVariable Integer binaryId)
            throws ContentProviderException, IOException {

        InputStreamResource result = null;
        HttpHeaders responseHeaders = new HttpHeaders();

        DocsLocalization docsLocalization = new DocsLocalization();

        docsLocalization.setPublicationId(String.valueOf(publicationId));

        StaticContentItem binaryItem = contentProvider.getStaticContent(binaryId, docsLocalization.getId(), docsLocalization.getPath());

        if (binaryItem == null) {
             return new ResponseEntity<>(result, responseHeaders, HttpStatus.NOT_FOUND);
        }
         result = new InputStreamResource(binaryItem.getContent());
     
        responseHeaders.setContentType(MediaType.parseMediaType(binaryItem.getContentType()));
        responseHeaders.setContentLength(binaryItem.getContent().available());
         
        return new ResponseEntity<>(result, responseHeaders, HttpStatus.OK);
    }
    

    private Boolean validate(Map<String, KeywordModel> keywords, Integer maxItems) throws ValidationException {
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
