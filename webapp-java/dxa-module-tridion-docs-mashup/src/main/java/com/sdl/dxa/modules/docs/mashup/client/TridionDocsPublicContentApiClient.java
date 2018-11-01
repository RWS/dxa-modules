package com.sdl.dxa.modules.docs.mashup.client;

import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.web.pca.client.PublicContentApi;
import com.sdl.web.pca.client.contentmodel.ContextData;
import com.sdl.web.pca.client.contentmodel.Pagination;
import com.sdl.web.pca.client.contentmodel.enums.ContentIncludeMode;
import com.sdl.web.pca.client.contentmodel.generated.ClaimValue;
import com.sdl.web.pca.client.contentmodel.generated.ClaimValueType;
import com.sdl.web.pca.client.contentmodel.generated.ComponentPresentation;
import com.sdl.web.pca.client.contentmodel.generated.CriteriaScope;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaValueType;
import com.sdl.web.pca.client.contentmodel.generated.InputCustomMetaCriteria;
import com.sdl.web.pca.client.contentmodel.generated.InputItemFilter;
import com.sdl.web.pca.client.contentmodel.generated.InputSortParam;
import com.sdl.web.pca.client.contentmodel.generated.Item;
import com.sdl.web.pca.client.contentmodel.generated.ItemConnection;
import com.sdl.web.pca.client.contentmodel.generated.ItemEdge;
import com.sdl.dxa.tridion.pcaclient.PCAClientProvider;
import com.sdl.web.pca.client.contentmodel.generated.Page;
import com.sdl.web.pca.client.contentmodel.generated.RawContent;
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

/**
 *
 * This class is a wrapper around the PCA client and tries to isolate the
 * related logic and codes for creating and performing the query and and
 * processing the results
 */
@SuppressWarnings("unchecked")
public class TridionDocsPublicContentApiClient implements ITridionDocsClient {

    private PublicContentApi _publicContentApi;
    private WebRequestContext _webRequestContext;

    public TridionDocsPublicContentApiClient(WebRequestContext webRequestContext, PCAClientProvider pcaClientProvider) {

        _webRequestContext = webRequestContext;
        
        _publicContentApi = pcaClientProvider.getClient();
    }

    @Override
    public List<Topic> getTridionDocsTopicsByKeywords(Map<String, KeywordModel> keywords, int maxItems) throws GraphQLClientException, IOException {

        List<ItemEdge> results = executeQuery(keywords, maxItems);
        List<Topic> topics = getDocsTopics(results);
        return topics;
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
        inputSortParam.setOrder(SortOrderType.Descending);
        inputSortParam.setSortBy(SortFieldType.LAST_PUBLISH_DATE);

        Pagination pagination = new Pagination();
        pagination.setFirst(maxItems);

        ContextData contextData = getContextData();

        ItemConnection results = _publicContentApi.executeItemQuery(filter, inputSortParam, pagination, null, ContentIncludeMode.INCLUDE_AND_RENDER , true , contextData);

        return results;
    }

    /**
     * Extracts and returns a collection of topics from the query's results
     */
    private List<Topic> getDocsTopics(List<ItemEdge> results) {

        List<Topic> topics = new LinkedList<Topic>();

        if (results != null) {

            for (ItemEdge edge : results) {

                if (edge.getNode() instanceof Page) {

                    Page page = (Page) edge.getNode();

                    // Based on the GraphQl's results and considering R2 model , we need to look into the below path to get the topic's title and body .
                    // page >  containerItems > componentPresentation > rawContent > data > Content  topicTitle and topicBody
                    Topic topic = new Topic();

                    List<Item> containerItems = page.getContainerItems();

                    if (containerItems != null) {

                        for (Item iItem : containerItems) {

                            if (iItem instanceof ComponentPresentation) {

                                ComponentPresentation componentPresentation = (ComponentPresentation) iItem;
                                RawContent rawContent = componentPresentation.getRawContent();
                                if (rawContent != null) {
                                    Map<String, Object> data = rawContent.getData();
                                    if (data != null) {

                                        if (data.get("XpmMetadata") != null && data.get("XpmMetadata") instanceof Map) {
                                            Map xpmMetadata = (Map) data.get("XpmMetadata");
                                            Object componentID = xpmMetadata.get("ComponentID");
                                            if (componentID != null) {
                                                topic.setId(componentID.toString());
                                            }
                                        }

                                        if (data.get("LinkUrl") != null) {
                                            Object linkUrl = data.get("LinkUrl");
                                            if (linkUrl != null) {
                                                String prefixForTopicsUrl = getPrefixForTopicsUrl();
                                                topic.setLink(getFullyQualifiedUrlForTopic(linkUrl.toString(), prefixForTopicsUrl));
                                            }
                                        }

                                        if (data.get("Content") != null && data.get("Content") instanceof Map) {
                                            Map content = (Map) data.get("Content");

                                            Object topicTitle = content.get("topicTitle");
                                            if (topicTitle != null) {
                                                topic.setTitle(new RichText(topicTitle.toString()));
                                            }

                                            Object topicBody = content.get("topicBody");
                                            if (topicBody != null) {
                                                topic.setBody(new RichText(topicBody.toString()));
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }

                    topics.add(topic);
                }
            }
        }

        return topics;
    }

    /**
     * Create and returns a ContextData instance containing the required
     * ClaimValues
     */
    private ContextData getContextData() {
        ContextData contextData = new ContextData();

        ClaimValue contentType = createClaimValue("dxa:modelservice:content:type", "model", ClaimValueType.STRING);
        contextData.addClaimValule(contentType);

        ClaimValue modelType = createClaimValue("dxa:modelservice:model:type", "r2", ClaimValueType.STRING);
        contextData.addClaimValule(modelType);

        ClaimValue linkRelative = createClaimValue("taf:tcdl:render:link:relative", "false", ClaimValueType.BOOLEAN);
        contextData.addClaimValule(linkRelative);

        ClaimValue entityRelativeLinks = createClaimValue("dxa:modelservice:model:entity:relativelinks", "false", ClaimValueType.BOOLEAN);
        contextData.addClaimValule(entityRelativeLinks);

        String prefixForTopicsUrl = getPrefixForTopicsUrl();
        if (prefixForTopicsUrl != null && !prefixForTopicsUrl.isEmpty()) {
            ClaimValue linkUrlprefix = createClaimValue("taf:tcdl:render:link:urlprefix", prefixForTopicsUrl, ClaimValueType.STRING);
            contextData.addClaimValule(linkUrlprefix);
        }

        String prefixForBinariesUrl = getPrefixForBinariesUrl();
        if (prefixForBinariesUrl != null && !prefixForBinariesUrl.isEmpty()) {
            ClaimValue linkBinaryUrlPrefix = createClaimValue("taf:tcdl:render:link:binaryUrlPrefix", prefixForBinariesUrl, ClaimValueType.STRING);
            contextData.addClaimValule(linkBinaryUrlPrefix);
        }

        return contextData;
    }

    /**
     * Create and returns a ClaimValue instance based on the provided parameters
     */
    private ClaimValue createClaimValue(String uri, String value, ClaimValueType Type) {
        ClaimValue claimValue = new ClaimValue();
        claimValue.setUri(uri);
        claimValue.setValue(value);
        claimValue.setType(Type);
        return claimValue;
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
        return _webRequestContext.getLocalization().getConfiguration("tridiondocsmashup.PrefixForTopicsUrl");
    }

    /**
     * Get the Uri prefix for the Topic links
     */
    private String getPrefixForBinariesUrl() {
        return _webRequestContext.getLocalization().getConfiguration("tridiondocsmashup.PrefixForBinariesUrl");
    }

    /**
     * Get the language name of the current localization
     */
    private String getCurrentLanguage() {
        return _webRequestContext.getLocalization().getCulture();
    }

    /**
     * Get the parent language name of the current localization
     */
    private String getParentLanguage() {

        String[] parts = _webRequestContext.getLocalization().getCulture().split("-");

        if (parts != null && parts.length > 1) {
            return parts[0];
        }

        return null;
    }
}
