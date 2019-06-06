package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntities;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperties;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.DynamicList;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.entity.Tag;
import com.sdl.webapp.common.api.model.query.SimpleBrokerQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;
import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;
import static com.sdl.webapp.common.util.LocalizationUtils.schemaIdFromSchemaKey;

@SemanticEntities({
        @SemanticEntity(entityName = "ItemList", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true),
        @SemanticEntity(entityName = "ItemList", vocabulary = SDL_CORE, prefix = "i"),
        @SemanticEntity(entityName = "ContentQuery", vocabulary = SDL_CORE, prefix = "q")
})
@Slf4j
@Data
@EqualsAndHashCode(callSuper = true)
public class ContentList extends DynamicList<Teaser, SimpleBrokerQuery> {

    @SemanticProperties({
            @SemanticProperty("s:headline"),
            @SemanticProperty("i:headline"),
            @SemanticProperty("q:headline")
    })
    @JsonProperty("Headline")
    private String headline;

    @SemanticProperties({
            @SemanticProperty("i:link"),
            @SemanticProperty("q:link")
    })
    @JsonProperty("Link")
    private Link link;

    @SemanticProperties({
            @SemanticProperty("i:pageSize"),
            @SemanticProperty("q:pageSize")
    })
    @JsonProperty("PageSize")
    private int pageSize = 10;

    @SemanticProperties({
            @SemanticProperty("i:contentType"),
            @SemanticProperty("q:contentType")
    })
    @JsonProperty("ContentType")
    private Tag contentType;

    @SemanticProperties({
            @SemanticProperty("i:sort"),
            @SemanticProperty("q:sort")
    })
    @JsonProperty("Sort")
    private Tag sort;

    @JsonProperty("CurrentPage")
    private int currentPage = 1;

    @JsonProperty("HasMore")
    private boolean hasMore;

    @SemanticProperties({
            @SemanticProperty("s:itemListElement"),
            @SemanticProperty("i:itemListElement")
    })
    @JsonProperty("ItemListElements")
    private List<Teaser> itemListElements = new ArrayList<>();

    @Override
    public SimpleBrokerQuery getQuery(@NotNull Localization localization) {
        SimpleBrokerQuery query = new SimpleBrokerQuery();
        query.setStartAt(getStart());
        query.setPublicationId(Integer.parseInt(localization.getId()));
        query.setPageSize(getPageSize());
        if (getContentType() != null) {
            query.setSchemaId(schemaIdFromSchemaKey(getContentType().getKey(), localization));
        } else {
            log.error("ContentType is null for {}", this);
        }

        if (getSort() != null) {
            query.setSort(getSort().getKey());
        } else {
            log.error("Sort is null for {}", this);
        }

        return query;
    }

    @Override
    public List<Teaser> getQueryResults() {
        return getItemListElements();
    }

    @Override
    public void setQueryResults(List<Teaser> queryResults, boolean hasMore) {
        setItemListElements(queryResults);
        setHasMore(hasMore);
    }

    @Override
    public void setQueryResults(List<Teaser> queryResults) {
        setItemListElements(queryResults);
    }

    @Override
    public Class<Teaser> getEntityType() {
        return Teaser.class;
    }

    @Override
    public void setStart(int start) {
        super.setStart(start);
        Assert.isTrue(getPageSize() > 0, "Page size should be > 0");
        setCurrentPage((start / getPageSize()) + 1);
    }
}
