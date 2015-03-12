package com.sdl.webapp.smarttarget.markup;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.Entity;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.markup.MarkupDecorator;
import com.sdl.webapp.common.markup.html.HtmlCommentNode;
import com.sdl.webapp.common.markup.html.HtmlNode;
import com.sdl.webapp.common.markup.html.ParsableHtmlNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.sdl.webapp.smarttarget.model.SmartTargetComponentPresentation;
import com.sdl.webapp.smarttarget.SmartTargetService;
import com.sdl.webapp.smarttarget.model.SmartTargetPromotion;

import java.util.Map;

/**
 * SmartTarget Promotion XPM Markup
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

        if ( webRequestContext.isPreview() ) {
            if ( model instanceof SmartTargetPromotion ) { //if (model instanceof Entity) {

                SmartTargetPromotion promotion = (SmartTargetPromotion) model;

                markup = HtmlBuilders.span()
                        .withContent(this.buildXpmMarkup(promotion.getId(), promotion.getMvcData().getRegionName()))
                        .withContent(markup).build();

            }
            else if ( model instanceof Entity ) {

                Entity entity = (Entity) model;
                final Map<String, String> entityData = entity.getEntityData();
                final String promotionId = entityData.get("PromotionID");
                if ( promotionId != null) {
                    final boolean isExperiment = Boolean.parseBoolean(entity.getEntityData().get("IsExperiment"));
                    if ( isExperiment ) {
                        SmartTargetComponentPresentation stComponentPresentation = this.smartTargetService.getSavedPromotionItem(promotionId, entity.getId());
                        if ( stComponentPresentation != null ) {
                            String processedHtml = this.smartTargetService.postProcessExperimentComponentPresentation(stComponentPresentation, markup.toHtml());
                            if (processedHtml != null) {
                                markup = new ParsableHtmlNode(processedHtml);
                            }
                        }
                    }
                }
            }
        }
        return markup;
    }

    @Override
    public int getPriority() {
        return 2;
    }

    private HtmlNode buildXpmMarkup(String promotionId, String regionId) {
        return new HtmlCommentNode(String.format(PROMOTION_PATTERN, promotionId, regionId));
    }
}
