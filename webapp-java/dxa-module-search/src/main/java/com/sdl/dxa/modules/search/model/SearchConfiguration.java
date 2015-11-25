package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

import java.util.Objects;

public class SearchConfiguration extends AbstractEntityModel {

    @JsonProperty("ResultsLink")
    private String resultsLink;

    @JsonProperty("SearchBoxPlaceHolderText")
    private String searchBoxPlaceHolderText;

    public String getResultsLink() {
        return resultsLink;
    }

    public void setResultsLink(String resultsLink) {
        this.resultsLink = resultsLink;
    }

    public String getSearchBoxPlaceHolderText() {
        return searchBoxPlaceHolderText;
    }

    public void setSearchBoxPlaceHolderText(String searchBoxPlaceHolderText) {
        this.searchBoxPlaceHolderText = searchBoxPlaceHolderText;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        SearchConfiguration that = (SearchConfiguration) o;
        return Objects.equals(resultsLink, that.resultsLink) &&
                Objects.equals(searchBoxPlaceHolderText, that.searchBoxPlaceHolderText);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), resultsLink, searchBoxPlaceHolderText);
    }

    @Override
    public String toString() {
        return "SearchConfiguration{" +
                "resultsLink='" + resultsLink + '\'' +
                ", searchBoxPlaceHolderText='" + searchBoxPlaceHolderText + '\'' +
                '}';
    }
}
