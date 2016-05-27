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
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;

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

//    @Override
//    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize) throws DxaException {
//        return super.toHtmlElement("<img src=\"{0}\"{1}{2}{3}>", aspect, cssClass, containerSize);
//    }
//    @Override
//    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize) throws DxaException {
//        String classAttr = isNullOrBlank(cssClass) ? "" : cssClass ;
//        String widthAttr = isNullOrBlank(widthFactor) ? "" : widthFactor ;
//        double aspectAttr = isNullOrBlank(ToString(aspect)) ? "" : aspect;
//        return super.toHtmlElement("<img src=\"{0}\"{1}{2}{3}>", Url, widthAttr, aspectAttr, classAttr);
//    }

    @Override
    public MvcData getMvcData() {
        return MvcDataCreator.creator()
                .fromQualifiedName("Test:TestFlickrImage")
                .defaults(DefaultsMvcData.CORE_ENTITY).create();
    }

    @Override
    public HtmlElement toHtmlElement(String widthFactor, double aspect, String cssClass, int containerSize, String contextPath) throws DxaException {

        return super.toHtmlElement(widthFactor, aspect, cssClass, containerSize, contextPath);
    }

}
