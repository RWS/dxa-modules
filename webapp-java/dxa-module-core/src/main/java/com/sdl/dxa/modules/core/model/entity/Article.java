package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Lists;
import com.sdl.webapp.common.api.formatters.support.FeedItem;
import com.sdl.webapp.common.api.formatters.support.FeedItemsProvider;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;

import java.util.List;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

@SemanticEntity(entityName = "Article", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
@Data
@EqualsAndHashCode(callSuper = true)
public class Article extends AbstractEntityModel implements FeedItemsProvider {

    @JsonProperty("Headline")
    @SemanticProperty("s:headline")
    private String headline;

    @JsonProperty("Image")
    @SemanticProperty("s:image")
    private Image image;

    @JsonProperty("Date")
    @SemanticProperty("s:dateCreated")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private DateTime date;

    @JsonProperty("Description")
    @SemanticProperty("s:about")
    private String description;

    @JsonProperty("ArticleBody")
    @SemanticProperty("s:articleBody")
    private List<Paragraph> articleBody;

    @Override
    public List<FeedItem> extractFeedItems() {
        return Lists.newArrayList(FeedItem.builder()
                .headline(headline)
                .summary(new RichText(description))
                .date(date != null ? date.toDate() : null)
                .build());
    }
}
