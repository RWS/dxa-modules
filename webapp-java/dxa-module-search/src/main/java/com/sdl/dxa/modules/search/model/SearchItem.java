package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.MvcDataImpl;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import org.apache.solr.client.solrj.beans.Field;

import java.util.Map;
import java.util.Objects;

/**
 * Contains the default fields that come back from Result, Excluded PublicationId and Id.
 */
public class SearchItem extends AbstractEntityModel {

    @Field
    @JsonProperty("Title")
    private String title;

    @Field
    @JsonProperty("Url")
    private String url;

    @JsonProperty("Summary")
    private String summary;

    @JsonProperty("CustomFields")
    private Map<String, Object> customFields;

    @Field
    @Override
    public void setId(String id) {
        super.setId(id);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Map<String, Object> getCustomFields() {
        return customFields;
    }

    public void setCustomFields(Map<String, Object> customFields) {
        this.customFields = customFields;
    }

    @Override
    public MvcData getMvcData() {
        return new MvcDataImpl("Search:SearchItem").defaults(MvcDataImpl.Defaults.CORE_ENTITY);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        SearchItem that = (SearchItem) o;
        return Objects.equals(title, that.title) &&
                Objects.equals(url, that.url) &&
                Objects.equals(summary, that.summary) &&
                Objects.equals(customFields, that.customFields);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), title, url, summary, customFields);
    }

    @Override
    public String toString() {
        return "SearchItem{" +
                "title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", summary='" + summary + '\'' +
                ", customFields=" + customFields +
                '}';
    }
}
