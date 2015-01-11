package com.sdl.webapp.smarttarget.markup;

import com.google.common.base.Strings;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.Entity;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlCommentNode;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.HtmlTextNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.sdl.webapp.smarttarget.SmartTargetRegion;
import com.sdl.webapp.smarttarget.SmartTargetService;

import java.util.Map;

/**
 * SmartTargetPromotionXpmMarkup
 *
 * @author nic
 */
public class SmartTargetPromotionXpmMarkup implements MarkupDecorator {

    private static final String PROMOTION_PATTERN = "Start Promotion: " +
            "{\"PromotionID\": \"%s\", \"RegionID\": \"%s\"}";

    private SmartTargetService smartTargetService;

    public SmartTargetPromotionXpmMarkup(SmartTargetService smartTargetService) {
        this.smartTargetService = smartTargetService;
    }

    @Override
    public HtmlNode process(HtmlNode markup, ViewModel model, WebRequestContext webRequestContext) {

        if ( model instanceof Entity) {
            Entity entity = (Entity) model;

            if ( entity.getEntityData().get("PromotionID") != null ) {

                markup = HtmlBuilders.span()
                        .withContent(this.buildXpmMarkup(entity))
                        .withContent(markup).build();
            }
        }

        // TODO: Generate analytics tracking keys
        // TODO: Here we need to get the whole process the whole body of the component presentation - how to do that???

        return markup;
    }

    @Override
    public int getPriority() {
        return 2;
    }

    private HtmlNode buildXpmMarkup(Entity entity) {
        final Map<String, String> entityData = entity.getEntityData();

        final String promotionId = entityData.get("PromotionID");
        if (Strings.isNullOrEmpty(promotionId)) {
            return null;
        }
        final String regionId = entityData.get("RegionID");
        return new HtmlCommentNode(String.format(PROMOTION_PATTERN, promotionId, regionId));
    }
}
