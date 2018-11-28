package com.sdl.dxa.modules.docs.mashup.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.modules.docs.mashup.exception.DocsMashupException;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.Pagination;
import com.sdl.web.pca.client.contentmodel.enums.ContentIncludeMode;
import com.sdl.web.pca.client.contentmodel.generated.CriteriaScope;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaValueType;
import com.sdl.web.pca.client.contentmodel.generated.InputCustomMetaCriteria;
import com.sdl.web.pca.client.contentmodel.generated.InputItemFilter;
import com.sdl.web.pca.client.contentmodel.generated.InputSortParam;
import com.sdl.web.pca.client.contentmodel.generated.ItemConnection;
import com.sdl.web.pca.client.contentmodel.generated.ItemEdge;
import com.sdl.web.pca.client.contentmodel.enums.ContentType;
import com.sdl.web.pca.client.contentmodel.enums.DataModelType;
import com.sdl.web.pca.client.contentmodel.enums.ModelServiceLinkRendering;
import com.sdl.web.pca.client.contentmodel.enums.TcdlLinkRendering;
import com.sdl.web.pca.client.contentmodel.generated.Page;
import com.sdl.web.pca.client.contentmodel.generated.SortFieldType;
import com.sdl.web.pca.client.contentmodel.generated.SortOrderType;
import com.sdl.web.pca.client.exception.GraphQLClientException;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.api.model.RichText;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * This class is a wrapper around the PCA client and tries to isolate the
 * related logic and codes for creating and performing the query and and
 * processing the results
 */
@SuppressWarnings("unchecked")
public class TridionDocsPublicContentApiClient implements TridionDocsClient {

    private final ApiClient apiClient;
    private final WebRequestContext webRequestContext;
    private final ObjectMapper objectMapper;
    private static final Logger LOG = LoggerFactory.getLogger(TridionDocsPublicContentApiClient.class);

    public static final String TOPICS_URL_PREFIX_CONFIGNAME = "tridiondocsmashup.PrefixForTopicsUrl";
    public static final String TOPICS_BINARYURL_PREFIX_CONFIGNAME = "tridiondocsmashup.PrefixForBinariesUrl";

    public TridionDocsPublicContentApiClient(WebRequestContext webRequestContext, ApiClient apiClient, ObjectMapper objectMapper) {

        this.webRequestContext = webRequestContext;
        this.objectMapper = objectMapper;
        this.apiClient = apiClient;

        this.apiClient.setDefaultContentType(ContentType.MODEL);
        this.apiClient.setDefaultModelType(DataModelType.R2);
        this.apiClient.setTcdlLinkRenderingType(TcdlLinkRendering.ABSOLUTE);
        this.apiClient.setModelSericeLinkRenderingType(ModelServiceLinkRendering.ABSOLUTE);
    }

    @Override
    public List<Topic> getTopicsByKeywords(Map<String, KeywordModel> keywords, int maxItems) throws DocsMashupException {

        try {
            List<ItemEdge> results = executeQuery(keywords, maxItems);
            List<Topic> topics = getDocsTopics(results);
            return topics;
        } catch (Exception e) {

            throw new DocsMashupException("Could not retrieved topics!", e);
        }
    }

    private List<ItemEdge> executeQuery(Map<String, KeywordModel> keywords, int maxItems) throws GraphQLClientException, IOException {

        if (maxItems < 1) {
            return null;
        }

        List<InputItemFilter> keywordFilters = getKeyWordFilters(keywords);

        // First , we filter the query based on the specified language in the current culture.
        InputItemFilter languageFilter = getLanguageFilter(getCurrentLanguage());

        ItemConnection results = executeItemQuery(keywordFilters, languageFilter, maxItems);

        // If no result, then we do another query based on the parent language (if exists).
        if (results == null || results.getEdges() == null || results.getEdges().isEmpty()) {
            String parentLanguage = getParentLanguage();

            if (parentLanguage != null && !parentLanguage.isEmpty()) {
                languageFilter = getLanguageFilter(parentLanguage);

                results = executeItemQuery(keywordFilters, languageFilter, maxItems);
            }
        }

        if (results != null) {
            return results.getEdges();
        }

        return null;
    }

    /**
     * Performs the query by PublicContentApi client based on the given filters
     */
    private ItemConnection executeItemQuery(List<InputItemFilter> keywordfilters, InputItemFilter languageFilter, int maxItems) throws GraphQLClientException, IOException {
        List<InputItemFilter> customMetaFilters = new ArrayList<>(keywordfilters);
        customMetaFilters.add(languageFilter);

        InputItemFilter filter = new InputItemFilter();
        filter.setNamespaceIds(Collections.singletonList(2));
        filter.setAnd(customMetaFilters);
        filter.setItemTypes(Collections.singletonList(com.sdl.web.pca.client.contentmodel.generated.FilterItemType.PAGE));

        InputSortParam inputSortParam = new InputSortParam();
        inputSortParam.setOrder(SortOrderType.Ascending);
        inputSortParam.setSortBy(SortFieldType.TITLE);

        Pagination pagination = new Pagination();
        pagination.setFirst(maxItems);
        
        apiClient.setTcdlLinkUrlPrefix(getPrefixForTopicsUrl());
        apiClient.setTcdlBinaryLinkUrlPrefix(getPrefixForBinariesUrl());

        ItemConnection results = apiClient.executeItemQuery(filter, inputSortParam, pagination, null, ContentIncludeMode.INCLUDE_JSON_AND_RENDER, false, null);

        return results;
    }

    /**
     * Extracts and returns a collection of topics from the query's results
     */
    private List<Topic> getDocsTopics(List<ItemEdge> results) throws IOException {

        List<Topic> topics = new LinkedList<Topic>();

        if (results != null) {

            for (ItemEdge edge : results) {

                if (!(edge.getNode() instanceof Page)) {
                    LOG.debug("Node is not a Page, skipping.");
                    continue;
                }

                Page page = (Page) edge.getNode();

                // Deserialize Page Content as R2 Data Model
                String pageModelJson = page.getRawContent().getContent();
                PageModelData pageModelData = this.objectMapper.readValue(pageModelJson, PageModelData.class);

                // Extract the R2 Data Model of the Topic and convert it to a Strongly Typed View Model
                EntityModelData topicModelData = pageModelData.getRegions().get(0).getEntities().get(0);

                //Todo : We need to use StronglyTypedTopicBuilder to create Topic entity model same as .Net
                //like EntityModel topicModel = ModelBuilderPipeline.CreateEntityModel(topicModelData, null, docsLocalization);
                String topicId = topicModelData.getXpmMetadata().get("ComponentID").toString();
                String topicTitle = topicModelData.getContent().getAndCast("topicTitle", String.class);
                String topicBody = topicModelData.getContent().getAndCast("topicBody", String.class);
                String topicUrl = topicModelData.getLinkUrl();

                Topic topic = new Topic();
                topic.setId(topicId);
                topic.setLink(getFullyQualifiedUrlForTopic(topicUrl, getPrefixForTopicsUrl()));
                topic.setTitle(new RichText(topicTitle));
                topic.setBody(new RichText(topicBody));

                topics.add(topic);
            }
        }

        return topics;
    }

    /**
     * Creates and returns a collection of InputItemFilter based on the given
     * keyword models
     */
    private static List<InputItemFilter> getKeyWordFilters(Map<String, KeywordModel> keywords) {

        List<InputItemFilter> keyWordFilters = new ArrayList<>();

        for (Map.Entry<String, KeywordModel> entry : keywords.entrySet()) {

            InputItemFilter keywordFilter = new InputItemFilter();

            InputCustomMetaCriteria customMeta = new InputCustomMetaCriteria();

            String key = getKeywordKey(entry.getKey());
            String value = entry.getValue().getId();
            CriteriaScope scope = getKeywordScope(entry.getKey());

            customMeta.setKey(key);
            customMeta.setValue(value);
            customMeta.setScope(scope);
            customMeta.setValueType(CustomMetaValueType.STRING);

            keywordFilter.setCustomMeta(customMeta);

            keyWordFilters.add(keywordFilter);
        }

        return keyWordFilters;
    }

    /**
     * Creates and returns an InputItemFilter based on the given language
     */
    private static InputItemFilter getLanguageFilter(String language) {

        InputItemFilter languageFilter = new InputItemFilter();

        InputCustomMetaCriteria customMeta = new InputCustomMetaCriteria();

        customMeta.setKey("DOC-LANGUAGE.lng.value");
        customMeta.setValue(language);
        customMeta.setScope(CriteriaScope.Publication);
        customMeta.setValueType(CustomMetaValueType.STRING);

        languageFilter.setCustomMeta(customMeta);

        return languageFilter;
    }

    /**
     * Extracts and returns the actual keyword's key from the provided field's
     * XML Name
     */
    private static String getKeywordKey(String keywordFiledXmlName) {
        // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE
        // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
        // We need to remove the scope and append ".element" to it (e.g. FMBPRODUCTRELEASENAME.Version.element).

        String scop = keywordFiledXmlName.split(Pattern.quote("."))[0];
        String key = keywordFiledXmlName.replace(scop + ".", "");
        return key + ".element";
    }

    /**
     * Extracts and returns the keyword filter's scope from the provided field's
     * XML Name
     */
    private static CriteriaScope getKeywordScope(String keywordFiledXmlName) {
        // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE
        // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
        // We need to get the first part (e.g. Item) and returns associated enum value.

        String scope = keywordFiledXmlName.split(Pattern.quote("."))[0];
        return CriteriaScope.valueOf(scope);
    }

    /**
     * Create and return the topic's url having fully qualified domain name
     */
    public String getFullyQualifiedUrlForTopic(String topicOriginalUrl, String prefixForTopicsUrl) {
        String uri = topicOriginalUrl;

        if (uri != null && !uri.isEmpty()) {
            URI topicUri = URI.create(uri);

            uri = topicUri.toString();

            if (!topicUri.isAbsolute()) {

                if (!uri.startsWith("/")) {
                    uri = "/" + uri;
                }

                if (prefixForTopicsUrl != null && !prefixForTopicsUrl.isEmpty()) {
                    topicUri = URI.create(prefixForTopicsUrl + uri);
                    uri = topicUri.toString();
                }
            }
        }

        return uri;
    }

    /**
     * Get the Uri prefix for the Topic binary links
     */
    private String getPrefixForTopicsUrl() {
        return webRequestContext.getLocalization().getConfiguration(TOPICS_URL_PREFIX_CONFIGNAME);
    }

    /**
     * Get the Uri prefix for the Topic links
     */
    private String getPrefixForBinariesUrl() {
        return webRequestContext.getLocalization().getConfiguration(TOPICS_BINARYURL_PREFIX_CONFIGNAME);
    }

    /**
     * Get the language name of the current localization
     */
    private String getCurrentLanguage() {
        return webRequestContext.getLocalization().getCulture();
    }

    /**
     * Get the parent language name of the current localization
     */
    private String getParentLanguage() {

        String[] parts = webRequestContext.getLocalization().getCulture().split("-");

        if (parts != null && parts.length > 1) {
            return parts[0];
        }

        return null;
    }
}
