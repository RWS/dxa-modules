package com.sdl.webapp.demandware.ecommerce.model;

import com.sdl.webapp.common.api.mapping.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntity;

import static com.sdl.webapp.common.api.mapping.config.SemanticVocabulary.SDL_CORE;

/**
 * Shopping Cart Widget
 *
 * @author nic
 */
@SemanticEntity(entityName = "ShoppingCartWidget", vocabulary = SDL_CORE, prefix = "c", public_ = true)
public class ShoppingCartWidget extends AbstractEntity {

    @SemanticProperty("c:title")
    private String title;

    @SemanticProperty("c:emptyMessage")
    private String emptyMessage;

    @SemanticProperty("c:summaryTitle")
    private String summaryTitle;

    @SemanticProperty("c:showOrderSummary")
    private String showOrderSummary;

    @SemanticProperty("c:_self")
    private String link;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEmptyMessage() {
        return emptyMessage;
    }

    public void setEmptyMessage(String emptyMessage) {
        this.emptyMessage = emptyMessage;
    }

    public String getSummaryTitle() {
        return summaryTitle;
    }

    public void setSummaryTitle(String summaryTitle) {
        this.summaryTitle = summaryTitle;
    }

    /*
    public String getShowOrderSummary() {
        return showOrderSummary;
    }

    public void setShowOrderSummary(String showOrderSummary) {
        this.showOrderSummary = showOrderSummary;
    }
    */

    public boolean isShowOrderSummary() {
        return showOrderSummary == null || showOrderSummary.equalsIgnoreCase("Yes");
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
