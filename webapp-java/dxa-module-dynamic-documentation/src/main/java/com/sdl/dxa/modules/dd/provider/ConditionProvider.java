package com.sdl.dxa.modules.dd.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.dd.models.Conditions;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Publication;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/// <summary>
/// Condition Provider
/// </summary>
@Component
public class ConditionProvider {
    private static final String ConditionUsed = "conditionsused.generated.value";
    private static final String ConditionMetadata = "conditionmetadata.generated.value";

    //Note: Don't put the DXA Objectmapper in here (don't use @Autowired) it is configured differently then needed here.
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ApiClientProvider pcaClientProvider;

    private class Condition {
        //[JsonProperty("datatype")]
        public String datatype;
        //[JsonProperty("range")]
        public boolean range;
        //[JsonProperty("values")]
        public String[] values;
    }

    public Map<String, List> getMergedConditions(Conditions conditions) throws IOException, DxaItemNotFoundException {
        if (conditions.getUserConditions() == null) {
            return new HashMap<>();
        }

        //Get values from publication:
        Map<String, Map> publicationConditions = getConditions(conditions.getPublicationId());

        //Overwrite/append with any user supplied conditions:
        Map<String, Map> result = new HashMap<>(publicationConditions);
        for (Map.Entry<String, List> userEntry : conditions.getUserConditions().entrySet()) {
            //result.put(userEntry.getKey(), userEntry.getValue());
            result.get(userEntry.getKey()).put("values", userEntry.getValue());
        }

        return null;
    }

    //TODO caching & make this return a clone (userconditions can overwrite values)
    public Map<String, Map> getConditions(int publicationId) throws DxaItemNotFoundException, IOException {
        String conditionUsed = getMetadata(publicationId, ConditionUsed);
        String conditionMetadata = getMetadata(publicationId, ConditionMetadata);
        Map<String, List> d1 = objectMapper.readValue(conditionUsed, Map.class);
        Map<String, Map> d2 = objectMapper.readValue(conditionMetadata, Map.class);
        for (Map.Entry<String, List> v : d1.entrySet()) {
            Map map = d2.get(v.getKey());
            map.put("values", v.getValue().toArray());
        }
        return d2;
    }

    private String getMetadata(int publicationId, String metadataName) throws DxaItemNotFoundException {
//            try
//            {
//                return SiteConfiguration.CacheProvider.GetOrAdd($"{publicationId}-{metadataName}",
//                    CacheRegion.Conditions,
//                    () =>
//                    {


        ApiClient client = pcaClientProvider.getClient();
        Publication publication = client.getPublication(ContentNamespace.Docs, publicationId,
                "requiredMeta:" + metadataName, null);
//        null, null);
        List<CustomMetaEdge> edges = publication.getCustomMetas().getEdges();
        if (publication == null || publication.getCustomMetas() == null || edges.size() == 0) {
            throw new DxaItemNotFoundException(
                    "Metadata '" + metadataName + "' is not found for publication " + publicationId + ".");
        }

        Object metadata = edges.get(0).getNode().getValue();
        String metadataString = metadata != null ? (String) metadata : "{}";
        return metadataString;
//                    });
//            }
//            catch (Exception)
//            {
//                throw new DxaItemNotFoundException(
//                    "Metadata '{metadataName}' is not found for publication {publicationId}.");
//            }
    }

}
