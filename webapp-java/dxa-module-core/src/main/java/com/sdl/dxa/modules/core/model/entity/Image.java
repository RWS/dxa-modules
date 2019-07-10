package com.sdl.dxa.modules.core.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.MediaItem;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.util.MimeUtils;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;
import static com.sdl.webapp.common.markup.html.builders.HtmlBuilders.img;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@SemanticEntity(entityName = "ImageObject", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
@Slf4j
@Data
@EqualsAndHashCode(callSuper = true)
public class Image extends MediaItem {

    @SemanticProperty("s:name")
    @JsonProperty("AlternateText")
    private String alternateText;

    @Override
    @JsonIgnore
    public boolean isImage() {
        return true;
    }

    @Override
    public HtmlElement toHtmlElement(String widthFactor) throws DxaException {
        return this.toHtmlElement(widthFactor, 0, "", 0);
    }

    @Override
    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize) throws DxaException {
        return toHtmlElement(widthFactor, aspect, cssClass, containerSize, "");
    }

    private boolean isResizable() {
        return !this.getMimeType().equalsIgnoreCase(MimeUtils.getMimeType("svg"));
    }

    @Override
    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize, String contextPath) throws DxaException {
        if (isEmpty(getUrl())) {
            log.warn("Skipping image with empty URL: {}", this.getUrl());
            throw new DxaException("URL is null for image component: " + this.getId());
        }

        String url = this.isResizable() ? getMediaHelper().getResponsiveImageUrl(getUrl(), widthFactor, aspect, containerSize) : getUrl();
        return img(url)
                .withAlt(this.alternateText)
                .withClass(cssClass)
                .withAttribute("data-aspect", String.valueOf(Math.round(aspect * 100) / 100.0))
                .withAttribute("width", widthFactor)
                .build();
    }

    @Override
    public void readFromXhtmlElement(Node xhtmlElement) {
        super.readFromXhtmlElement(xhtmlElement);

        this.alternateText = xhtmlElement.getAttributes().getNamedItem("alt").getNodeValue();
        this.setMvcData(getMvcData());
    }

    @Override
    public String toString() {
        try {
            return this.toHtmlElement().renderHtml();
        } catch (DxaException e) {
            log.warn("Could not render image with URL {}.", this.getUrl());
            return "";
        }
    }

    @Override
    public MvcData getDefaultMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("Core:Entity:Image")
                .defaults(DefaultsMvcData.ENTITY)
                .create();
    }
}
