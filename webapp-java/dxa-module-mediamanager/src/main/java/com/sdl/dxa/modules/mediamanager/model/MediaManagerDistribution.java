package com.sdl.dxa.modules.mediamanager.model;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.MvcDataImpl;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.exceptions.DxaException;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SDL_CORE;

@SemanticEntity(entityName = "ExternalContentLibraryStubSchemamm", vocabulary = SDL_CORE, prefix = "s")
public class MediaManagerDistribution extends EclItem {

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
        return UriComponentsBuilder.fromHttpUrl(getUrl()).path("/embed").build().encode().toString();
    }

    @Override
    public String getMimeType() {
        return (String) getFromExternalMetadataOrAlternative("Program/Asset/MIMEType", super.getMimeType());
    }

    public String getTitle() {
        return (String) getFromExternalMetadataOrAlternative("Program/Asset/Title", getFileName());
    }

    public String getDescription() {
        return (String) getFromExternalMetadataOrAlternative("Program/Asset/Description", null);
    }

    @Override
    public MvcData getMvcData() {
        return new MvcDataImpl("MediaManager:" + getDisplayTypeId());
    }

    @Override
    public String toHtml(String widthFactor, double aspect, String cssClass, int containerSize) throws DxaException {
        cssClass = StringUtils.isEmpty(cssClass) ? "" : String.format(" class=\"%s\"", cssClass);

        final UUID uuid = UUID.randomUUID();
        switch (getDisplayTypeId()) {
            case "html5dist":
                return String.format("<div%s><div id=\"%s\"></div><script src=\"%s&trgt=%s&responsive=true\"></script></div>",
                        cssClass, uuid, getEmbedScriptUrl(), uuid);
            case "imagedist":
                String aspectAttr = aspect == 0.0 ? "" :
                        String.format(" data-aspect=\"%s\"", NumberFormat.getNumberInstance(Locale.getDefault()).format(aspect));
                widthFactor = StringUtils.isEmpty(widthFactor) ? "" : String.format(" width=\"%s\"", widthFactor);
                return String.format("<img src=\"%s\"%s%s%s>", getUrl(), widthFactor, aspectAttr, cssClass);
            default:
                return super.toHtml(widthFactor, aspect, cssClass, containerSize);
        }
    }
}
