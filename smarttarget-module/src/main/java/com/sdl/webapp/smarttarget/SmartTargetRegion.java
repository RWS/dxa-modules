package com.sdl.webapp.smarttarget;

import com.sdl.webapp.common.api.model.region.RegionImpl;

/**
 * SmartTargetRegion
 *
 * @author nic
 */
public class SmartTargetRegion extends RegionImpl {

    private boolean containsSmartTargetContent = false;

    public boolean containsSmartTargetContent() {
        return containsSmartTargetContent;
    }

    public void setContainsSmartTargetContent(boolean containsSmartTargetContent) {
        this.containsSmartTargetContent = containsSmartTargetContent;
    }
}
