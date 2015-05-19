package com.sdl.webapp.context.markup;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.ParsableHtmlNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.sdl.webapp.context.ContextProfile;
import com.sdl.webapp.context.ContextService;
import org.jsoup.nodes.Element;

/**
 * EntityContextProfileMarkupDecorator
 *
 * @author nic
 */
public class ContextProfileEntityMarkup implements MarkupDecorator {

    private ContextService contextService;

    public ContextProfileEntityMarkup(ContextService contextService) {
        this.contextService = contextService;
    }

    @Override
    public int getPriority() {
        return 5;
    }

    @Override
    public HtmlNode process(HtmlNode markup, ViewModel model, WebRequestContext webRequestContext) {

        ContextProfile viewContextProfile = (ContextProfile) model.getMvcData().getMetadata().get("ViewContextProfile");

        String viewContextProfileName;
        if ( viewContextProfile == null ) {
            viewContextProfileName = "default";
        }
        else {
            viewContextProfileName = viewContextProfile.getName();
        }

        if ( viewContextProfileName != null && webRequestContext.isPreview() ) {

            boolean markupInjected = false;

            if ( markup instanceof ParsableHtmlNode) {

                // Add the context classes and data to the root element of the entity
                //
                ParsableHtmlNode entityMarkup = (ParsableHtmlNode) markup;
                Element element = entityMarkup.getHtmlElement();
                if ( element != null ) {   // If an HTML element (not a comment etc)

                    element.addClass("context-profile");
                    element.attr("data-context-profile", viewContextProfileName);
                    markupInjected = true;
                }
            }

            if ( !markupInjected ) {
                markup =
                        HtmlBuilders.span()
                                .withAttribute("class", "context-profile")
                                .withAttribute("data-context-profile", viewContextProfileName)
                                .withContent(markup).build();
            }

        }

        return markup;
    }
}
