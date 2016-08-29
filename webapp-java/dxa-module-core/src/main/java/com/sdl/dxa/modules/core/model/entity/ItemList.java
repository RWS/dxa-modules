package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.formatters.support.FeedItem;
import com.sdl.webapp.common.api.formatters.support.FeedItemsProvider;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

@SemanticEntity(entityName = "ItemList", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
@Data
@EqualsAndHashCode(callSuper = true)
public class ItemList extends AbstractEntityModel implements FeedItemsProvider {

    @JsonProperty("Headline")
    @SemanticProperty("s:headline")
    private String headline;

    // single/plural ending explanation: schema.org & CM say it is element (single) because CM operates with them as with
    // single entities.
    // So since we actually have multiple elements it was decided to call it elements (plural) in DXA.
    @JsonProperty("ItemListElements")
    @SemanticProperty("s:itemListElement")
    private List<Teaser> itemListElements;

    @Override
    public List<FeedItem> extractFeedItems() {
        return collectFeedItems(itemListElements);
    }
}
