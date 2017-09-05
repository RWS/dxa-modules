package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Collections2;
import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * <p>SmartTargetPromotion class.</p>
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NeverCached(qualifier = "SmartTargetPromotion")
public class SmartTargetPromotion extends AbstractEntityModel {

    @JsonProperty("Title")
    private String title;

    @JsonProperty("Slogan")
    private String slogan;

    @JsonProperty("Items")
    private List<SmartTargetItem> items;

    /**
     * {@inheritDoc}
     */
    @Override
    public String getXpmMarkup(Localization localization) {
        Map<String, Object> xpmMetadata = getXpmMetadata();
        if (isEmpty(xpmMetadata)) {
            return "";
        }

        return String.format("<!-- Start Promotion: { \"PromotionID\": \"%s\", \"RegionID\" : \"%s\" } -->",
                xpmMetadata.get("PromotionID"), xpmMetadata.get("RegionID"));
    }

    @JsonIgnore
    public Collection<EntityModel> getEntityModels() {
        return Collections2.transform(this.items, SmartTargetItem::getEntity);
    }

}
