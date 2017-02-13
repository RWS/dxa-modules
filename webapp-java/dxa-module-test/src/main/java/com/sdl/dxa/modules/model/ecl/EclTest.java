package com.sdl.dxa.modules.model.ecl;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.api.model.mvcdata.DefaultsMvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataCreator;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@SemanticEntity(entityName = "ExternalContentLibraryStubSchemaflickr", prefix = "s", vocabulary = SemanticVocabulary.SDL_CORE, public_ = true)
@EqualsAndHashCode(callSuper = true)
@Data
public class EclTest extends EclItem {


    @SemanticProperty("s:testProp1")
    @JsonProperty("testProp1")
    private String testProp1;

    @SemanticProperty("s:testProp2")
    @JsonProperty("testProp2")
    private int testProp2;

    @SemanticProperty("s:testProp3")
    @JsonProperty("testProp3")
    private DateTime testProp3;

    @SemanticProperty("s:testProp4")
    @JsonProperty("testProp4")
    private String testProp4;

    @Override
    public MvcData getMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("Test:TestFlickrImage")
                .defaults(DefaultsMvcData.ENTITY).create();
    }

    @Override
    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize, String contextPath) throws DxaException {
        String classAttr = isEmpty(cssClass) ? "" : String.format(" class=\"%s\"", cssClass);
        String widthAttr = isEmpty(widthFactor) ? "" : String.format(" width=\"%s\"", widthFactor);
        String aspectAttr = (aspect == 0) ? "" : String.format(" data-aspect=\"%f\"", aspect);
        return HtmlBuilders.empty().withPureHtmlContent(
                String.format("<img src=\"%s\"%s%s%s>", getUrl(), widthAttr, aspectAttr, classAttr)).build();
    }

}
