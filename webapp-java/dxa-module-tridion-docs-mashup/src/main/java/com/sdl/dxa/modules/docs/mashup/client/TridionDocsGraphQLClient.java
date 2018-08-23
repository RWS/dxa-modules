/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sdl.dxa.modules.docs.mashup.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.web.client.configuration.api.ConfigurationException;
import com.sdl.web.pca.client.DefaultGraphQLClient;
import com.sdl.web.pca.client.GraphQLClient;
import com.sdl.web.pca.client.exception.GraphQLClientException;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.KeywordModel;
import com.sdl.webapp.common.util.InitializationUtils;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.rmi.UnexpectedException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 *
 * This class is a wrapper around the GraphQLClient client and tries to isolate
 * the related logic and codes for creating and performing the query and and
 * processing the results
 */
public class TridionDocsGraphQLClient implements ITridionDocsClient {

    private TridionDocsClientConfig _clientConfig;
    private WebRequestContext _webRequestContext;
    private String _graphQlEndpoint;

    public TridionDocsGraphQLClient(WebRequestContext webRequestContext) throws ConfigurationException, UnsupportedEncodingException {
        _webRequestContext = webRequestContext;

        _clientConfig = new TridionDocsClientConfig();

        _graphQlEndpoint = InitializationUtils.loadDxaProperties().getProperty("dxa.module.tridion.docs.mashup.graphQlEndpoint");

        if (_graphQlEndpoint == null || _graphQlEndpoint.isEmpty()) {

            _graphQlEndpoint = _clientConfig.getGraphQLEndpoint();
        }
    }

    @Override
    public List<Topic> getTopics(Map<String, KeywordModel> keywords, int maxItems) throws GraphQLClientException, IOException {
        List<Topic> topics = new ArrayList<>();

        String language = getCurrentLanguage();
        String query = getQuery(keywords, language, maxItems);

        String jsonResponse = execute(query);

        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addDeserializer(List.class, new TopicDeserializer());
        module.addDeserializer(Error.class, new ErrorDeserializer());
        mapper.registerModule(module);

        //Check for error first 
        Error error = mapper.readValue(jsonResponse, Error.class);
        if (error != null) {
            throw new UnexpectedException(error.getMessage());
        }

        topics = mapper.readValue(jsonResponse, List.class);

        if (topics == null || topics.isEmpty()) {

            language = getParentLanguage();
            if (language != null && !language.isEmpty()) {
                query = getQuery(keywords, language, maxItems);
                jsonResponse = execute(query);
                topics = mapper.readValue(jsonResponse, List.class);
            }
        }

        return topics;
    }

    private String getQuery(Map<String, KeywordModel> keywords, String language, int maxItems) {
        StringBuilder customMetas = new StringBuilder();

        for (Map.Entry<String, KeywordModel> entry : keywords.entrySet()) {
            String key = getKeywordKey(entry.getKey());
            String scope = getKeywordScope(entry.getKey());
            String value = entry.getValue().getId();
            String keywordFilter = String.format("{\"customMeta\":{\"key\":\"%s\",\"scope\":\"%s\",\"value\":\"%s\",\"valueType\":\"STRING\"}},", key, scope, value);
            customMetas.append(keywordFilter);
        }

        String languageFilter = String.format("{\"customMeta\":{\"key\":\"DOC-LANGUAGE.lng.value\",\"scope\":\"%s\",\"value\":\"%s\",\"valueType\":\"STRING\"}}", "Publication", language);

        customMetas.append(languageFilter);

        String filters = String.format("{ \"first\" : %d ,\"after\":null,"
                + "\"filter\":{"
                + "\"itemTypes\":[\"%s\"] ,"
                + "\"namespaceIds\":[2],"
                + "\"and\":["
                + "%s"
                + " ]"
                + " }",
                maxItems, "PAGE", customMetas.toString());

        return getQuery(filters);
    }

    private String getQuery(String filters) {
        return "{\"query\":\"query items($first: Int, $after: String, $filter: InputItemFilter!, $sort: InputSortParam, $contextData: [InputClaimValue!]) {\\r\\n\\titems(first: $first, after: $after, filter: $filter, sort: $sort, contextData: $contextData) {\\r\\n\\t\\tedges {\\r\\n\\t\\t\\tcursor\\r\\n\\t\\t\\tnode {\\r\\n\\t\\t\\t\\t...ItemFields\\t\\t\\t\\t\\r\\n\\t\\t\\t\\t...PageFields\\n\\r\\n\\t\\t\\t}\\t\\t\\r\\n\\t\\t}\\r\\n\\t}\\r\\n}fragment ItemFields on Item {\\r\\n    id\\r\\n    itemId\\r\\n    itemType\\r\\n    namespaceId\\r\\n    owningPublicationId\\r\\n    publicationId\\r\\n    title\\r\\n    lastPublishDate\\r\\n    creationDate\\r\\n    initialPublishDate\\r\\n    updatedDate   \\r\\n    ...CustomMetaFields\\r\\n}\\r\\nfragment PageFields on Page {\\r\\n\\turl\\r\\n\\trawContent(renderContent: false) {\\r\\n\\t\\tdata \\r\\n\\t}\\r\\n\\tcontainerItems(types: [COMPONENT_PRESENTATION]) {\\r\\n\\t\\t...on ComponentPresentation {\\r\\n\\t\\t\\t...ComponentPresentationFields\\r\\n\\t\\t}\\t\\t\\r\\n\\t}\\r\\n}\\r\\nfragment CustomMetaFields on Item {\\r\\n  customMetas {\\r\\n    edges {\\r\\n      node {\\r\\n          id\\r\\n          itemId\\r\\n          key\\r\\n          namespaceId\\r\\n          publicationId\\r\\n          value\\r\\n          valueType    \\r\\n      }\\r\\n    }\\r\\n  }\\r\\n}fragment ComponentPresentationFields on ComponentPresentation {\\r\\n    itemType\\r\\n\\trawContent(renderContent: false) {\\r\\n\\t\\tdata \\r\\n\\t}\\r\\n}\\r\\n\",\"variables\":" + filters + ",\"sort\":{\"order\":\"Descending\",\"sortBy\":\"LAST_PUBLISH_DATE\"},\"contextData\":[]}}";
    }

    private String execute(String query) throws GraphQLClientException, UnsupportedEncodingException {
        Map<String, String> headers = new HashMap<>();

        headers.put(_clientConfig.getAuthRequestHeaderName(), _clientConfig.getAuthRequestHeaderValue());

        GraphQLClient graphQLClient = new DefaultGraphQLClient(_graphQlEndpoint, headers);

        return graphQLClient.execute(query);
    }

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
    private static String getKeywordScope(String keywordFiledXmlName) {
        // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE  
        // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
        // We need to get the first part (e.g. Item) and returns associated enum value.

        String scope = keywordFiledXmlName.split(Pattern.quote("."))[0];
        return scope;
    }

}
