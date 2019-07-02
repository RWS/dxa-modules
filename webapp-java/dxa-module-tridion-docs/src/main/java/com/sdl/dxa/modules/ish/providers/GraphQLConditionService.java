package com.sdl.dxa.modules.ish.providers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.dxa.tridion.pcaclient.GraphQLUtils;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Publication;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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

    //TODO caching & make this return a clone (userconditions can overwrite values)
    @Override
    public String getConditions(Integer publicationId, Localization localization) {
        Map<String, Map> objectConditions = null;
        try {
            objectConditions = getObjectConditions(publicationId, localization);
        } catch (DxaItemNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            return objectMapper.writeValueAsString(objectConditions);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Map> getObjectConditions(int publicationId, Localization localization) throws DxaItemNotFoundException, IOException {
        String conditionUsed = getMetadata(publicationId, localization, ConditionUsed);
        String conditionMetadata = getMetadata(publicationId, localization, ConditionMetadata);
        Map<String, List> d1 = objectMapper.readValue(conditionUsed, Map.class);
        Map<String, Map> d2 = objectMapper.readValue(conditionMetadata, Map.class);
        for (Map.Entry<String, List> v : d1.entrySet()) {
            Map map = d2.get(v.getKey());
            map.put("values", v.getValue().toArray());
        }
        return d2;
    }

    private String getMetadata(int publicationId, Localization localization, String metadataName) throws DxaItemNotFoundException {
        ApiClient client = pcaClientProvider.getClient();
        ContentNamespace docs = GraphQLUtils.convertUriToGraphQLContentNamespace(localization.getCmUriScheme());
        Publication publication = client.getPublication(docs, publicationId,
                "requiredMeta:" + metadataName, null);
        List<CustomMetaEdge> edges = publication.getCustomMetas().getEdges();
        if (publication == null || publication.getCustomMetas() == null) {
            throw new DxaItemNotFoundException(
                    "Metadata '" + metadataName + "' is not found for publication " + publicationId + ".");
        }
        if (edges.size() == 0) {
            return "{}";
        }
        Object metadata = edges.get(0).getNode().getValue();
        String metadataString = metadata != null ? (String) metadata : "{}";
        return metadataString;
    }

}
