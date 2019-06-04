package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;

/**
 * <p>SmartTargetRegion class.</p>
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SmartTargetRegion extends RegionModelImpl {
    /**
     * Indicates whether the Region has SmartTarget content (Promotions) or fallback content.
     */
    @JsonProperty("HasSmartTargetContent")
    private boolean isFallbackContentReplaced;

    /**
     * The maximum number of SmartTarget items to output in this Region.
     */
    @JsonProperty("MaxItems")
    private int maxItems;

    public SmartTargetRegion(RegionModel other) {
        super(other);
        if (other instanceof SmartTargetRegion) {
            SmartTargetRegion smartTargetRegion = (SmartTargetRegion) other;
            this.isFallbackContentReplaced = smartTargetRegion.isFallbackContentReplaced;
            this.maxItems = smartTargetRegion.maxItems;
        }
    }

    /**
     * <p>Constructor for SmartTargetRegion.</p>
     *
     * @param name a {@link String} object.
     * @throws DxaException if any.
     */
    public SmartTargetRegion(String name) throws DxaException {
        super(name);
    }

    /**
     * <p>Constructor for SmartTargetRegion.</p>
     *
     * @param name              a {@link String} object.
     * @param qualifiedViewName a {@link String} object.
     * @throws DxaException if any.
     */
    public SmartTargetRegion(String name, String qualifiedViewName) throws DxaException {
        super(name, qualifiedViewName);
    }

    /**
     * <p>Constructor for SmartTargetRegion.</p>
     *
     * @param mvcData a {@link MvcData} object.
     * @throws DxaException if any.
     */
    public SmartTargetRegion(MvcData mvcData) throws DxaException {
        super(mvcData);
    }

    /**
     * Gets the Start Query XPM markup (for staging sites).
     * <p>
     * A SmartTarget Region has two pieces of XPM markup: a "Start Promotion Region" tag and a "Start Query" tag.
     * The regular XPM markup mechanism (Html.DxaRegionMarkup()) renders the "Start Promotion Region" tag and this method
     * should be called from the Region View code to render the "Start Query" tag in the right location.
     * </p>
     *
     * @return the "Start Query" XPM markup if the site is a staging site or an empty string otherwise
     */
    @JsonIgnore
    public String getStartQueryXpmMarkup() {
        Map<String, Object> xpmMetadata = this.getXpmMetadata();
        return String.valueOf(xpmMetadata != null && xpmMetadata.containsKey("Query") ? xpmMetadata.get("Query") : "");
    }

    @Override
    public SmartTargetRegion deepCopy() {
        return new SmartTargetRegion(this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getXpmMarkup(Localization localization) {
        return String.format("<!-- Start Promotion Region: { \"RegionID\": \"%s\" } -->", this.getName());
    }
}
