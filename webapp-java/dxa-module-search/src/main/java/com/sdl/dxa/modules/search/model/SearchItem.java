package com.sdl.dxa.modules.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.solr.client.solrj.beans.Field;

import java.util.Map;

/**
 * Contains the default fields that come back from Result, Excluded PublicationId and Id.
 */
@EqualsAndHashCode(callSuper = true)
@Data
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

    @Override
    public MvcData getMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("Search:SearchItem")
                .defaults(DefaultsMvcData.CORE_ENTITY).create();
    }
}
