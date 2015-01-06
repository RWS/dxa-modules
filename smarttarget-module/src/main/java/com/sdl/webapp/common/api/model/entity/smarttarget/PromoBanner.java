package com.sdl.webapp.common.api.model.entity.smarttarget;

import com.sdl.webapp.common.api.mapping.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntity;
import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.api.model.entity.MediaItem;

import static com.sdl.webapp.common.api.mapping.config.SemanticVocabulary.SDL_CORE;

/**
 * PromoBanner
 *
 * @author nic
 */

@SemanticEntity(entityName = "PromoBanner", vocabulary = SDL_CORE, prefix = "pb", public_ = true)
public class PromoBanner extends AbstractEntity {

    @SemanticProperty("pb:headline")
    private String headline;

    @SemanticProperty("pb:content")
    private String content;

    @SemanticProperty("pb:media")
    private MediaItem media;

    @SemanticProperty("pb:link")
    private Link link;

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MediaItem getMedia() {
        return media;
    }

    public void setMedia(MediaItem media) {
        this.media = media;
    }

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
    }

    @Override
    public String toString() {
        return "PromoBanner{" +
                "headline='" + headline + '\'' +
                ", content='" + content + '\'' +
                ", media=" + media +
                ", link=" + link +
                '}';
    }
}
