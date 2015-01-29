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

        // TODO: Are we having several items per promotion at anytime? Now is the assumption that one ST promo = one content presentation
        // Do some analyze of the code or use some kind of marker to be able to see if there is a content already in this promotion.
        // For example add a marker element to the tree so the decorator can find where the previous component presentation are in the promotion.
        //

        if ( webRequestContext.isPreview() ) {
            if (model instanceof Entity) {
                Entity entity = (Entity) model;
                final Map<String, String> entityData = entity.getEntityData();
                final String promotionId = entityData.get("PromotionID");
                if ( promotionId != null) {
                    final String regionId = entityData.get("RegionID");
                    final boolean isExperiment = Boolean.parseBoolean(entity.getEntityData().get("IsExperiment"));
                    if ( isExperiment ) {
                        SmartTargetComponentPresentation stComponentPresentation = this.smartTargetService.getSavedPromotion(promotionId);
                        String processedHtml = this.smartTargetService.postProcessExperimentComponentPresentation(stComponentPresentation, markup.toHtml());
                        if ( processedHtml != null ) {
                            markup = new ParsableHtmlNode(processedHtml);
                        }
                    }
                    markup = HtmlBuilders.span()
                            .withContent(this.buildXpmMarkup(promotionId, regionId))
                            .withContent(markup).build();
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
