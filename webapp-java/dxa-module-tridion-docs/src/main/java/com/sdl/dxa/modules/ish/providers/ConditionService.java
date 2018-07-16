package com.sdl.dxa.modules.ish.providers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sdl.web.api.meta.WebPublicationMetaFactory;
import com.sdl.webapp.common.controller.exception.InternalServerErrorException;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.tridion.broker.StorageException;
import com.tridion.meta.PublicationMeta;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service which provides conditions for specific publication.
 */
@Slf4j
@Service
public class ConditionService {
    private static final String CONDITION_USED = "conditionsused.generated.value";
    private static final String CONDITION_METADATA = "conditionmetadata.generated.value";
    private static final String CONDITION_VALUES = "values";
    private final JsonParser parser = new JsonParser();

    @Autowired
    private WebPublicationMetaFactory webPublicationMetaFactory;

    public JsonObject getConditions(Integer publicationId) {
        JsonObject conditionUsed = getMetadataJson(publicationId, CONDITION_USED);
        JsonObject conditionMetadata = getMetadataJson(publicationId, CONDITION_METADATA);

        for (Map.Entry<String, JsonElement> entry : conditionUsed.entrySet()) {
            JsonElement conditionValues = entry.getValue();
            JsonObject dataType = conditionMetadata.get(entry.getKey()).getAsJsonObject();
            JsonObject newValue = new JsonObject();
            newValue.add(CONDITION_VALUES, conditionValues);
            for (Map.Entry<String, JsonElement> dataTypeEntry : dataType.entrySet()) {
                newValue.add(dataTypeEntry.getKey(), dataTypeEntry.getValue());
            }
            conditionUsed.add(entry.getKey(), newValue);
        }
        return conditionUsed;
    }

    private JsonObject getMetadataJson(Integer publicationId, String metadataName) {
        try {
            PublicationMeta publicationMeta = webPublicationMetaFactory.getMeta(publicationId);
            if (publicationMeta == null || publicationMeta.getCustomMeta() == null) {
                throw new NotFoundException("Metadata '" + metadataName + "' is not found for publication "
                        + publicationId);
            }
            Object metadata = publicationMeta.getCustomMeta().getFirstValue(metadataName);
            String metadataString = metadata != null ? String.valueOf(metadata) : "{}";
            return (JsonObject) parser.parse(metadataString);

        } catch (StorageException ex) {
            throw new InternalServerErrorException("Unable to retrieve metadata '" + metadataName + "' for publication "
                    + publicationId, ex);
        }
    }
}
