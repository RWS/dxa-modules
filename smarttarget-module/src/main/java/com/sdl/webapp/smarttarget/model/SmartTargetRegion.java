package com.sdl.webapp.smarttarget.model;

import com.sdl.webapp.common.api.model.region.RegionImpl;

/**
 * SmartTargetRegion
 *
 * @author nic
 */
public class SmartTargetRegion extends RegionImpl {

    private boolean containsSmartTargetContent = false;
    private String xpmMarkup;

    public boolean containsSmartTargetContent() {
        return containsSmartTargetContent;
    }

    public void setContainsSmartTargetContent(boolean containsSmartTargetContent) {
        this.containsSmartTargetContent = containsSmartTargetContent;
    }

    public String getXpmMarkup() {
        return xpmMarkup;
    }

    public void setXpmMarkup(String xpmMarkup) {
        this.xpmMarkup = xpmMarkup;
    }
}
