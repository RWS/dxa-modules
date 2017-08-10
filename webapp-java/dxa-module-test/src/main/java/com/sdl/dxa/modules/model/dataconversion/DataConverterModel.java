package com.sdl.dxa.modules.model.dataconversion;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.skyscreamer.jsonassert.JSONCompareResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.skyscreamer.jsonassert.JSONCompare.compareJSON;

@EqualsAndHashCode(callSuper = true)
@Data
@RequestMapping
@Slf4j
@NeverCached(qualifier = "DataConverterModel")
@SemanticEntity(entityName = "Content")
public class DataConverterModel extends AbstractEntityModel {

    private static final String MODEL_TYPE_PARAM_NAME = "modelType";

    private static final String R2_PUB_ID_PARAM_NAME = "r2PubId";

    private static final String DD4T_PUB_ID_PARAM_NAME = "dd4tPubId";

    private static final String MODEL_SERVICE_HOST_PARAM_NAME = "modelServiceHost";

    private static final String R2_JSON_URL_FORMAT = "http://%s:8998/PageModel/tcm/%s/index?modelType=%s";

    private static final String DD4T_JSON_FORMAT = "http://%s:8998/PageModel/tcm/%s/example-legacy/index?modelType=%s";

    private static final String MISSING_PARAMETER_MESSAGE_FORMAT = "Expected '%s' parameter is missing in the query string: %s";

    @SemanticProperty("SingleLineText")
    @JsonProperty("SingleLineText")
    public String singleLineText;

    // Gets a map with current request parameters
    public Map<String, String[]> getRequestParameters() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getParameterMap();
    }

    // Gets current request query string
    public String getQueryString() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getQueryString();
    }

    // Constructs URL for R2 Data Model JSON
    public String getR2JsonUrl() {
        return String.format(R2_JSON_URL_FORMAT, getModelServiceHost(), getR2PubId(), getModelType());
    }

    // Constructs URL for DD4T (Legacy) Data Model JSON
    public String getDd4tJsonUrl() {
        return String.format(DD4T_JSON_FORMAT, getModelServiceHost(), getDd4tPubId(), getModelType());
    }

    // Gets Model Type from the request parameters
    public String getModelType() {
        if (getRequestParameters().containsKey(MODEL_TYPE_PARAM_NAME)) {
            if (Arrays.asList("R2", "DD4T").contains(getRequestParameters().get(MODEL_TYPE_PARAM_NAME)[0])) {
                return getRequestParameters().get(MODEL_TYPE_PARAM_NAME)[0];
            } else {
                throw new IllegalArgumentException("Allowed values for '" + MODEL_TYPE_PARAM_NAME + "' parameter are: 'R2', 'DD4T'.");
            }
        } else {
            throw new IllegalArgumentException(String.format(MISSING_PARAMETER_MESSAGE_FORMAT, MODEL_TYPE_PARAM_NAME, getQueryString()));
        }
    }

    // Gets R2 publication ID from the request parameters
    private String getR2PubId() {
        if (getRequestParameters().containsKey(R2_PUB_ID_PARAM_NAME)) {
            if (StringUtils.isNumeric(getRequestParameters().get(R2_PUB_ID_PARAM_NAME)[0])) {
                return getRequestParameters().get(R2_PUB_ID_PARAM_NAME)[0];
            } else {
                throw new IllegalArgumentException("'" + R2_PUB_ID_PARAM_NAME + "' parameter value should be a valid Publication ID number.");
            }
        } else {
            throw new IllegalArgumentException(String.format(MISSING_PARAMETER_MESSAGE_FORMAT, R2_PUB_ID_PARAM_NAME, getQueryString()));
        }
    }

    // Gets DD4T (Legacy) publication ID from the request parameters
    private String getDd4tPubId() {
        if (getRequestParameters().containsKey(DD4T_PUB_ID_PARAM_NAME)) {
            if (StringUtils.isNumeric(getRequestParameters().get(DD4T_PUB_ID_PARAM_NAME)[0])) {
                return getRequestParameters().get(DD4T_PUB_ID_PARAM_NAME)[0];
            } else {
                throw new IllegalArgumentException("'" + DD4T_PUB_ID_PARAM_NAME + "' parameter value should be a valid Publication ID number.");
            }
        } else {
            throw new IllegalArgumentException(String.format(MISSING_PARAMETER_MESSAGE_FORMAT, DD4T_PUB_ID_PARAM_NAME, getQueryString()));
        }
    }

    // Gets Model Service host from the request parameters
    private String getModelServiceHost() {
        if (getRequestParameters().containsKey(MODEL_SERVICE_HOST_PARAM_NAME)) {
            return getRequestParameters().get(MODEL_SERVICE_HOST_PARAM_NAME)[0];
        } else {
            throw new IllegalArgumentException(String.format(MISSING_PARAMETER_MESSAGE_FORMAT, MODEL_SERVICE_HOST_PARAM_NAME, getQueryString()));
        }
    }

    // Model Service and creates a JSON object from the response
    private JSONObject getJsonObject(String jsonUrl) throws IOException, JSONException {
        return new JSONObject(new BufferedReader(new InputStreamReader(new URL(jsonUrl).openStream())).readLine());
    }

    // Compares two given JSON objects based on provided parameters
    // Returns comparison success status and comparison result message
    public Map<String, Object> jsonDiff() throws IOException, JSONException {
        Map<String, Object> jsonDiffResults = new HashMap<>();
        JSONCompareResult jsonCompareResult;
        JSONCompareMode jsonCompareMode = JSONCompareMode.LENIENT;
        if ("R2".equals(getModelType())) {
            // Comparing R2 data model with a model converted from DD4T
            jsonCompareResult = compareJSON(getJsonObject(getR2JsonUrl()), getJsonObject(getDd4tJsonUrl()), jsonCompareMode);
        } else {
            // Comparing DD4T data model with a model converted from R2
            jsonCompareResult = compareJSON(getJsonObject(getDd4tJsonUrl()), getJsonObject(getR2JsonUrl()), jsonCompareMode);
        }
        jsonDiffResults.put("testPassed", String.valueOf(jsonCompareResult.passed()));
        jsonDiffResults.put("compareMessage", jsonCompareResult.getMessage().split(";"));
        return jsonDiffResults;
    }
}
