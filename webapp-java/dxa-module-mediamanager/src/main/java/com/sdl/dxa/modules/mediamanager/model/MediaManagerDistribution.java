package com.sdl.dxa.modules.mediamanager.model;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.markup.html.builders.ImgElementBuilder;
import lombok.Getter;
import org.springframework.util.CollectionUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;
import static com.sdl.webapp.common.markup.html.builders.HtmlBuilders.div;
import static com.sdl.webapp.common.markup.html.builders.HtmlBuilders.img;
import static com.sdl.webapp.common.markup.html.builders.HtmlBuilders.script;
import static java.lang.String.format;

@SemanticEntity(entityName = "ExternalContentLibraryStubSchemamm", vocabulary = SDL_CORE, prefix = "s")
@Getter
public class MediaManagerDistribution extends EclItem {

    @SemanticProperty("s:clientSideScript")
    private String clientSideScript;

    @SemanticProperty("s:videoAutoplay")
    private String videoAutoplay;

    @SemanticProperty("s:videoSubtitles")
    private String videoSubtitles;

    @SemanticProperty("s:videoControls")
    private String videoControls;

    public String getGlobalId() {
        final Map<String, Object> externalMetadata = getExternalMetadata();
        if (!CollectionUtils.isEmpty(externalMetadata) && externalMetadata.containsKey("GlobalId")) {
            return Objects.toString(externalMetadata.get("GlobalId"));
        }

        return UriComponentsBuilder.fromHttpUrl(getUrl()).build().getQueryParams().getFirst("o");
    }

    public String getDistributionJsonUrl() {
        return UriComponentsBuilder.fromHttpUrl(getUrl())
                .replacePath("/json/")
                .replaceQuery("")
                .path(getGlobalId())
                .build().encode().toString();
    }

    public String getEmbedScriptUrl() {
        return UriComponentsBuilder.fromHttpUrl(getUrl()).pathSegment("embed").build().encode().toString();
    }

    public String getTitle() {
        Object first = getFromExternalMetadataOrAlternative(getExternalMetadata(), "Program/Asset/Title", null);
        if (first == null) {
            return (String) getFromExternalMetadataOrAlternative(getExternalMetadata(), "Program/Title", super.getFileName());
        }
        return (String) first;
    }

    public String getDescription() {
        return (String) getFromExternalMetadataOrAlternative(getExternalMetadata(), "Program/Asset/Description", null);
    }

    @Override
    public String getFileName() {
        return getTitle();
    }

    @Override
    public String getMimeType() {
        return (String) getFromExternalMetadataOrAlternative(getExternalMetadata(), "Program/Asset/MIMEType", super.getMimeType());
    }

    @Override
    public void setUrl(String url) {
        super.setUrl(url != null ? url.replaceAll("/\\?", "?") : null);
    }

    @Override
    public MvcData getMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("MediaManager:" + getDisplayTypeId())
                .defaults(DefaultsMvcData.CORE_ENTITY)
                .create();
    }

    @Override
    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize, String contextPath) throws DxaException {
        switch (getDisplayTypeId()) {
            case "html5dist":
                return getHtml5Dist(cssClass);
            case "imagedist":
                return getImageDist(widthFactor, aspect, cssClass);
            default:
                return super.toHtmlElement(widthFactor, aspect, cssClass, containerSize, contextPath);
        }
    }

    private HtmlElement getImageDist(String widthFactor, double aspect, String cssClass) {

        final ImgElementBuilder elementBuilder = img().withSrc(getUrl())
                .withClass(cssClass)
                .withAttribute("width", widthFactor);
        if (aspect != 0.0) {
            elementBuilder.withAttribute("data-aspect", NumberFormat.getNumberInstance(Locale.getDefault()).format(aspect));
        }

        return elementBuilder.build();
    }

    private HtmlElement getHtml5Dist(String cssClass) {
        final UUID uuid = UUID.randomUUID();
        return div()
                .withClass(cssClass)
                .withNode(
                        div().withId(uuid.toString()).build()
                )
                .withNode(
                        script().withSrc(format("%s&trgt=%s&responsive=true", getEmbedScriptUrl(), uuid)).build()
                ).build();
    }
}
