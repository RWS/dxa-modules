package com.sdl.dxa.modules.ish.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.dxa.tridion.pcaclient.GraphQLUtils;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Publication;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@Profile("!cil.providers.active")
public class GraphQLConditionService implements ConditionService {
    private static final String ConditionUsed = "conditionsused.generated.value";
    private static final String ConditionMetadata = "conditionmetadata.generated.value";

    //Note: Don't put the DXA Objectmapper in here (don't use @Autowired) it is configured differently then needed here.
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ApiClientProvider pcaClientProvider;

    @Override
    @Cacheable(value = "ish",
            key = "{ #publicationId, #localization.id }",
            condition = "#localization != null && #localization.id != null",
            sync = true)
    public String getConditions(Integer publicationId, Localization localization) {
        try {
            Map<String, Map> objectConditions = getObjectConditions(publicationId, localization);
            return objectMapper.writeValueAsString(objectConditions);
        } catch (Exception e) {
            throw new IshServiceException("Error processing conditions for publication " + publicationId, e);
        }
    }

    @Override
    public Map<String, Map> getObjectConditions(int publicationId, Localization localization) throws DxaItemNotFoundException, IOException {
        List<String> metadatas = getMetadata(publicationId, localization, ConditionUsed, ConditionMetadata);
        Map<String, List> d1 = objectMapper.readValue(metadatas.get(0), Map.class);
        Map<String, Map> d2 = objectMapper.readValue(metadatas.get(1), Map.class);
        for (Map.Entry<String, List> v : d1.entrySet()) {
            Map map = d2.get(v.getKey());
            map.put("values", v.getValue().toArray());
        }
        return d2;
    }

    private List<String> getMetadata(int publicationId, Localization localization, String... metadataNames) throws DxaItemNotFoundException {
        ApiClient client = pcaClientProvider.getClient();
        ContentNamespace namespace = GraphQLUtils.convertUriToGraphQLContentNamespace(localization.getCmUriScheme());
        List<String> result = new java.util.ArrayList<>();
        for (String metadataName : metadataNames) {
            Publication pub = client.getPublication(namespace, publicationId, "requiredMeta:" + metadataName, null);
            if (pub == null || pub.getCustomMetas() == null) {
                throw new DxaItemNotFoundException("Metadata '" + metadataName + "' is not found for publication " + publicationId);
            }
            List<CustomMetaEdge> edges = pub.getCustomMetas().getEdges();

            if (edges.isEmpty()) {
                result.add("{}");
            }
            Object metadata = edges.get(0).getNode().getValue();
            String metadataString = metadata != null ? (String) metadata : "{}";
            result.add(metadataString);
        }
        return result;
    }

}
