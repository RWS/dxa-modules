package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Lists;
import com.sdl.webapp.common.api.formatters.support.FeedItem;
import com.sdl.webapp.common.api.formatters.support.FeedItemsProvider;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntities;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperties;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.entity.MediaItem;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;

import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@SemanticEntities({
        @SemanticEntity(entityName = "Image", vocabulary = SDL_CORE, prefix = "i"),
        @SemanticEntity(entityName = "Article", vocabulary = SDL_CORE, prefix = "a"),
        @SemanticEntity(entityName = "NewsArticle", vocabulary = SDL_CORE, prefix = "na"),
        @SemanticEntity(entityName = "Place", vocabulary = SDL_CORE, prefix = "p"),
        @SemanticEntity(entityName = "LinkedContent", vocabulary = SDL_CORE, prefix = "c"),
        @SemanticEntity(entityName = "StandardMetadata", vocabulary = SDL_CORE, prefix = "m")
})
@Data
@EqualsAndHashCode(callSuper = true)
public class Teaser extends AbstractEntityModel implements FeedItemsProvider {

    @SemanticProperties({
            @SemanticProperty("na:_self"),
            @SemanticProperty("a:_self"),
            @SemanticProperty("p:_self"),
            @SemanticProperty("c:link")
    })
    @JsonProperty("Link")
    private Link link;

    @SemanticProperties({
            @SemanticProperty("m:name"),
            @SemanticProperty("na:name"),
            @SemanticProperty("a:name"),
            @SemanticProperty("headline"),
            @SemanticProperty("subheading"),
            @SemanticProperty("a:headline"),
            @SemanticProperty("p:name"),
            @SemanticProperty("c:headline"),
            @SemanticProperty("c:subheading")
    })
    @JsonProperty("Headline")
    private String headline;

    @SemanticProperties({
            @SemanticProperty("i:_self"),
            @SemanticProperty("a:image"),
            @SemanticProperty("c:media")
    })
    @JsonProperty("Media")
    private MediaItem media;

    @SemanticProperties({
            @SemanticProperty("m:introText"),
            @SemanticProperty("na:introText"),
            @SemanticProperty("a:introText"),
            @SemanticProperty("content"),
            @SemanticProperty("c:text"),
            @SemanticProperty("c:content"),
            @SemanticProperty("m:description"),
    })
    @JsonProperty("Text")
    private RichText text;

    @SemanticProperties({
            @SemanticProperty("c:date"),
            @SemanticProperty("m:dateCreated")
    })
    @JsonProperty("Date")
    private DateTime date;

    @SemanticProperties({
            @SemanticProperty("p:location"),
            @SemanticProperty("c:location")
    })
    @JsonProperty("Location")
    private Location location;

    public RichText getText() {
        return text != null ? text : new RichText("");
    }

    @Override
    public List<FeedItem> extractFeedItems() {
        return Lists.newArrayList(FeedItem.builder()
                .headline(headline)
                .summary(text)
                .link(getLinkForFeedItem())
                .date(date != null ? date.toDate() : null)
                .build());
    }

    private Link getLinkForFeedItem() {
        if (link != null) {
            return link;
        }
        if (media != null) {
            Link result = new Link();
            result.setUrl(media.getUrl());
            return result;
        }
        return null;
    }
}
