package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.solr.client.solrj.beans.Field;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Contains the default fields that come back from Result, Excluded PublicationId and Id.
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SearchItem extends AbstractEntityModel {

    @Field
    @JsonProperty("Title")
    private List<String> title = new ArrayList<>();

    @Field
    @JsonProperty("Url")
    private String url;

    @JsonProperty("Summary")
    private List<String> summary = new ArrayList<>();

    @JsonProperty("CustomFields")
    private Map<String, Object> customFields;

    @Field
    @Override
    public void setId(String id) {
        super.setId(id);
    }

    @Override
    public MvcData getDefaultMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("Search:SearchItem")
                .defaults(DefaultsMvcData.ENTITY).create();
    }

    public void setTitle(String title) {
        this.title.clear();
        this.title.add(title);
    }

    public void setSummary(String summary) {
        this.summary.clear();
        this.summary.add(summary);
    }

    public String getTitle() {
        return title == null || title.isEmpty() ? "" : title.get(0);
    }

    public String getSummary() {
        return summary == null || summary.isEmpty() ? "" : summary.get(0);
    }
}