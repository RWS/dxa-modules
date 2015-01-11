package com.sdl.webapp.smarttarget.markup;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlElement;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.HtmlTextNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.sdl.webapp.common.markup.html.builders.SimpleElementBuilder;
import com.sdl.webapp.smarttarget.SmartTargetRegion;

/**
 * SmartTarget Region XPM Markup
 *
 * @author nic
 */
public class SmartTargetRegionXpmMarkup implements MarkupDecorator {

    @Override
    public HtmlNode process(HtmlNode markup, ViewModel model, WebRequestContext webRequestContext) {

        if ( model instanceof SmartTargetRegion )  {
            SmartTargetRegion stRegion = (SmartTargetRegion) model;

            markup  =
                    HtmlBuilders.span()
                            .withLiteralContent(stRegion.getXpmMarkup())
                            .withContent(markup).build();

            /* NEEDED???
            markup = HtmlBuilders.span()
                    .withLiteralContent("<!-- Start Promotion Region: {\"RegionID\": \"" + stRegion.getName() + "\"} -->")
                    .withContent(markup).build();
                    */
        }
        return markup;
    }

    @Override
    public int getPriority() {
        return 0;
    }
}
