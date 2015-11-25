package com.sdl.dxa.modules.search.model;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Base class for Search Query/Results.
 */
@SemanticEntity(entityName = "ItemList", prefix = "s", vocabulary = SemanticVocabulary.SDL_CORE, public_ = true)
public class SearchQuery extends AbstractEntityModel {

    @SemanticProperty("s:headline")
    private String headline;

    private String resultsText;

    private String noResultsText;

    private String searchItemView = "Search:SearchItem";

    private int pageSize = 10;

    // Below properties are mapped (by the Search Controller) to query string parameters
    // todo refactor to separate data structure
    private String queryText;
    private int start;
    private Map<String, String> queryStringParameters;

    // Below properties reflect the search results (set by the Search Provider)
    // todo refactor to separate data structure
    private int currentPage;
    private int total;
    private boolean hasMore;

    @SemanticProperty("s:itemListElement")
    private List<SearchItem> results = new ArrayList<>();

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getResultsText() {
        return resultsText;
    }

    public void setResultsText(String resultsText) {
        this.resultsText = resultsText;
    }

    public String getNoResultsText() {
        return noResultsText;
    }

    public void setNoResultsText(String noResultsText) {
        this.noResultsText = noResultsText;
    }

    public String getSearchItemView() {
        return searchItemView;
    }

    public void setSearchItemView(String searchItemView) {
        this.searchItemView = searchItemView;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getQueryText() {
        return queryText;
    }

    public void setQueryText(String queryText) {
        this.queryText = queryText;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public Map<String, String> getQueryStringParameters() {
        return queryStringParameters;
    }

    public void setQueryStringParameters(Map<String, String> queryStringParameters) {
        this.queryStringParameters = queryStringParameters;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }

    public List<SearchItem> getResults() {
        return results;
    }

    public void setResults(List<SearchItem> results) {
        this.results = results;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        SearchQuery that = (SearchQuery) o;
        return pageSize == that.pageSize &&
                start == that.start &&
                currentPage == that.currentPage &&
                total == that.total &&
                hasMore == that.hasMore &&
                Objects.equals(headline, that.headline) &&
                Objects.equals(resultsText, that.resultsText) &&
                Objects.equals(noResultsText, that.noResultsText) &&
                Objects.equals(searchItemView, that.searchItemView) &&
                Objects.equals(queryText, that.queryText) &&
                Objects.equals(queryStringParameters, that.queryStringParameters) &&
                Objects.equals(results, that.results);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), headline, resultsText, noResultsText, searchItemView, pageSize, queryText, start, queryStringParameters, currentPage, total, hasMore, results);
    }

    @Override
    public String toString() {
        return "SearchQuery{" +
                "headline='" + headline + '\'' +
                ", resultsText='" + resultsText + '\'' +
                ", noResultsText='" + noResultsText + '\'' +
                ", searchItemView='" + searchItemView + '\'' +
                ", pageSize=" + pageSize +
                ", queryText='" + queryText + '\'' +
                ", start=" + start +
                ", queryStringParameters=" + queryStringParameters +
                ", currentPage=" + currentPage +
                ", total=" + total +
                ", hasMore=" + hasMore +
                ", results=" + results +
                '}';
    }
}
