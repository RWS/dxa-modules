package com.sdl.webapp.smarttarget;

import java.util.List;

/**
 * SmartTargetQueryResult
 *
 * @author nic
 */
public class SmartTargetQueryResult {

    private List<SmartTargetComponentPresentation> componentPresentations;
    private String xpmMarkup;

    public List<SmartTargetComponentPresentation> getComponentPresentations() {
        return componentPresentations;
    }

    public void setComponentPresentations(List<SmartTargetComponentPresentation> componentPresentations) {
        this.componentPresentations = componentPresentations;
    }

    public String getXpmMarkup() {
        return xpmMarkup;
    }

    public void setXpmMarkup(String xpmMarkup) {
        this.xpmMarkup = xpmMarkup;
    }
}