package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

import java.util.Objects;

public class SearchBox extends AbstractEntityModel {

    @JsonProperty("ResultsLink")
    private String resultsLink;

    @JsonProperty("SearchBoxPlaceholderText")
    private String searchBoxPlaceholderText;

    public String getResultsLink() {
        return resultsLink;
    }

    public void setResultsLink(String resultsLink) {
        this.resultsLink = resultsLink;
    }

    public String getSearchBoxPlaceholderText() {
        return searchBoxPlaceholderText;
    }

    public void setSearchBoxPlaceholderText(String searchBoxPlaceholderText) {
        this.searchBoxPlaceholderText = searchBoxPlaceholderText;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        SearchBox searchBox = (SearchBox) o;
        return Objects.equals(resultsLink, searchBox.resultsLink) &&
                Objects.equals(searchBoxPlaceholderText, searchBox.searchBoxPlaceholderText);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), resultsLink, searchBoxPlaceholderText);
    }

    @Override
    public String toString() {
        return "SearchBox{" +
                "resultsLink='" + resultsLink + '\'' +
                ", searchBoxPlaceholderText='" + searchBoxPlaceholderText + '\'' +
                '}';
    }
}
