package com.sdl.dxa.modules.docs.mashup.client;

/* 
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.web.pca.client.DefaultGraphQLClient;
import com.sdl.web.pca.client.GraphQLClient;
import com.sdl.web.pca.client.exceptions.GraphQLClientException;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.KeywordModel;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import com.sdl.web.pca.client.PublicContentApi;
import com.sdl.web.pca.client.contentmodel.*;
import com.sdl.webapp.common.util.InitializationUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

*/ 

/**
 *
 * This class is a wrapper around the PublicContentApi client and tries to
 * isolate the related logic and codes for creating the filters and performing
 * the query and processing the results
 */

/* 
public class TridionDocsClient implements ITridionDocsClient {

    private GraphQLClient _graphQLClient;
    private PublicContentApi _publicContentApi;
    private WebRequestContext _webRequestContext;

    public TridionDocsClient(WebRequestContext webRequestContext) {
        _webRequestContext = webRequestContext;

        // Todo : should be removed , as PCA client itself will read it from the DiscoveryService
        String graphQlEndpoint = InitializationUtils.loadDxaProperties().getProperty("dxa.module.tridion.docs.mashup.graphQlEndpoint");
        if (graphQlEndpoint == null || graphQlEndpoint.isEmpty()) {
            graphQlEndpoint = "http://stgecl2016:8091/udp/content";
        }

        // Todo : should be removed , as  PCA client will be provided and initialized by DXA , like SiteConfiguration.PublicContentApi;
        _graphQLClient = new DefaultGraphQLClient(graphQlEndpoint, new HashMap<>());

        _publicContentApi = new PublicContentApi(_graphQLClient);

    }

    @Override
    public List<Topic> getTridionDocsTopicsByKeywords(Map<String, KeywordModel> keywords, int maxItems) throws GraphQLClientException, IOException {

        List<ItemEdge> results = executeQuery(keywords, maxItems);
        List<Topic> topics = getDocsTopics(results);
        return topics;
    }
*/

    /**
     * Extracts and returns a collection of topics from the query's results
    
    private List<Topic> getDocsTopics(List<ItemEdge> results) {

        List<Topic> topics = new ArrayList<Topic>();

        if (results != null) {

            for (ItemEdge edge : results) {
                // Based on the GraphQl's results , we need to look into the below path to get the topic's title and body . 
                // page >  containerItems > componentPresentation > component > fields >  topicTitle and topicBody
                if (edge.getNode() instanceof Page) {

                    Page page = (Page) edge.getNode();

                    Topic topic = new Topic();

                    topic.Id = page.getId();
                    // Todo : the page.Url doesn't have the host name, UDP team is working on it :  https://jira.sdl.com/browse/UDP-4772                 
                    topic.Link = page.getUrl();
                    topic.Title = page.getTitle();

                    List<IItem> containerItems = page.getContainerItems();

                    // Todo :  page.getContainerItems() is always null !!!!!
                    if (containerItems != null) {

                        for (IItem iItem : containerItems) {

                            if (iItem instanceof ComponentPresentation) {

                                ComponentPresentation componentPresentation = (ComponentPresentation) iItem;

                                IContentComponent component = componentPresentation.getComponent();

                                if (component != null) {
                                    //topic.Body =?
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
 */

    /**
     * Creates the required filters and performs the query to fetch and return
     * the results
    
    private List<ItemEdge> executeQuery(Map<String, KeywordModel> keywords, int maxItems) throws GraphQLClientException, IOException {

        if (maxItems < 1) {
            return null;
        }

        List<InputItemFilter> keywordFilters = getKeyWordFilters(keywords);

        // First , we filter the query based on the specified language in the current culture.
        InputItemFilter languageFilter = getLanguageFilter(getCurrentLanguage());

        ItemConnection results = executeItemQuery(keywordFilters, languageFilter, maxItems);

        // If no result, then we do another query based on the parent language (if exists).
        if (results == null || results.getEdges() == null || results.getEdges().size() == 0) {
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
    *  */

    /**
     * Performs the query by PublicContentApi client based on the given filters
    
    private ItemConnection executeItemQuery(List<InputItemFilter> keywordfilters, InputItemFilter languageFilter, int maxItems) throws GraphQLClientException, IOException {
        List<InputItemFilter> customMetaFilters = new ArrayList<>(keywordfilters);

        customMetaFilters.add(languageFilter);

        InputItemFilter filter = new InputItemFilter();

        filter.setNamespaceIds(Collections.singletonList(2));
        filter.setItemTypes(Collections.singletonList(ItemType.PAGE));
        filter.setAnd(customMetaFilters);

        Pagination pagination = new Pagination();
        pagination.setFirst(maxItems);

        // Todo : where is the sort option ?! like  new InputSortParam { Order = SortOrderType.Descending, SortBy = SortFieldType.LAST_PUBLISH_DATE }
        ContentQuery contentQuery = _publicContentApi.executeItemQuery(filter, pagination, ContentQuery.class);

        return contentQuery.getItems();
    }
    */

    /**
     * Creates and returns a collection of InputItemFilter based on the given
     * keyword models
  
    private static List<InputItemFilter> getKeyWordFilters(Map<String, KeywordModel> keywords) {

        List<InputItemFilter> keyWordFilters = new ArrayList<>();

        for (Map.Entry<String, KeywordModel> entry : keywords.entrySet()) {

            InputItemFilter keywordFilter = new InputItemFilter();

            InputCustomMetaCriteria customMeta = new InputCustomMetaCriteria();

            String key = getKeywordKey(entry.getKey());
            CriteriaScope scope = getKeywordScope(entry.getKey());
            String value = entry.getValue().getId();

            customMeta.setKey(key);
            customMeta.setValue(value);
            customMeta.setScope(scope);
            customMeta.setValueType(CustomMetaValueType.STRING);

            keywordFilter.setCustomMeta(customMeta);

            keyWordFilters.add(keywordFilter);
        }

        return keyWordFilters;
    }
   */

    /**
     * Creates and returns an InputItemFilter based on the given language
    
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
    * 
     */

    /**
     * Extracts and returns the actual keyword's key from the provided field's
     * XML Name
    
    private static String getKeywordKey(String keywordFiledXmlName) {
        // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE 
        // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
        // We need to remove the scope and append ".element" to it (e.g. FMBPRODUCTRELEASENAME.Version.element).

        String scop = keywordFiledXmlName.split(Pattern.quote("."))[0];
        String key = keywordFiledXmlName.replace(scop + ".", "");
        return key + ".element";
    }
     */

    /**
     * Extracts and returns the keyword filter's scope from the provided field's
     * XML Name
    
    private static CriteriaScope getKeywordScope(String keywordFiledXmlName) {
        // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE  
        // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
        // We need to get the first part (e.g. Item) and returns associated enum value.

        String scope = keywordFiledXmlName.split(Pattern.quote("."))[0];
        return CriteriaScope.valueOf(scope);
    }
     */
 /**

    private String getCurrentLanguage() {
        return _webRequestContext.getLocalization().getCulture();
    }

    private String getParentLanguage() {

        String[] parts = _webRequestContext.getLocalization().getCulture().split("-");

        if (parts != null && parts.length > 1) {
            return parts[0];
        }

        return null;
    }
}
  */