package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.sdl.dxa.modules.search.serializer.FlatRichTextSerializer;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.sdl.webapp.common.util.StringUtils.convertFormatStringFromCM;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.web.util.UriUtils.decode;

/**
 * Base class for Search Query/Results.
 */
@EqualsAndHashCode(callSuper = true)
@Data
@SemanticEntity(entityName = "ItemList", prefix = "s", vocabulary = SemanticVocabulary.SDL_CORE, public_ = true)
public class SearchQuery extends AbstractEntityModel {

    @SemanticProperty("s:headline")
    @JsonProperty("Headline")
    private String headline;

    @JsonProperty("ResultsText")
    @JsonSerialize(using = FlatRichTextSerializer.class)
    private RichText resultsText;

    @JsonProperty("NoResultsText")
    @JsonSerialize(using = FlatRichTextSerializer.class)
    private RichText noResultsText;

    @JsonProperty("QueryDetails")
    private QueryDetails queryDetails;

    /*
     * Reflects the current position of pager (set by the Search Provider).
     */
    @SemanticProperty("s:pageSize")
    @JsonProperty("PageSize")
    private int pageSize;

    @JsonProperty("Start")
    private int start;

    @JsonProperty("Total")
    private long total;

    @SemanticProperty("s:itemListElement")
    @JsonProperty("Results")
    private List<SearchItem> results = new ArrayList<>();

    public String formatResultsText() {
        return String.format(
                convertFormatStringFromCM(resultsText == null ? "" : resultsText.toString()),
                queryDetails == null ? "" : queryDetails.getQueryText(), getTotal());
    }

    public String formatNoResultsText() {
        return String.format(
                convertFormatStringFromCM(noResultsText == null ? "" : noResultsText.toString()),
                queryDetails == null ? "" : queryDetails.getQueryText());
    }

    @JsonProperty("CurrentPage")
    public int getCurrentPage() {
        return 1 + (getStart() - 1) / getPageSize();
    }

    public boolean hasMoreResults() {
        return (getStart() + getPageSize()) <= getTotal();
    }

    public String pagerLink(int position) {
        return String.format("?start=%d&q=%s", position, queryDetails.getQueryText());
    }

    /**
     * Query details mapped by the Search Controller to query string parameters.
     */
    @Data
    public static class QueryDetails {

        @JsonProperty("QueryText")
        private String queryText;

        @JsonProperty("QueryStringParameters")
        private Map<String, String[]> queryStringParameters;

        public QueryDetails(String queryText, Map<String, String[]> queryStringParameters) {
            this.queryText = queryText;
            this.queryStringParameters = queryStringParameters;
        }

        public String getQueryText() {
            try {
                return isEmpty(queryText) ? "" : decode(queryText, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("Should never happen", e);
            }
        }
    }
}
