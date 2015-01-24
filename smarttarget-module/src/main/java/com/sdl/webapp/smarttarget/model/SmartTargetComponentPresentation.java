package com.sdl.webapp.smarttarget.model;

import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;

/**
 * SmartTarget Component Presentation
 *
 * @author nic
 */
public class SmartTargetComponentPresentation {

    private String regionName;
    private String componentUri;
    private String templateUri;
    private String promotionId;
    private String additionalMarkup = "";
    private boolean isExperiment = false;
    private boolean isVisible = true;
    private ExperimentDimensions experimentDimensions;

    public SmartTargetComponentPresentation(String componentUri, String templateUri, String promotionId, String regionName) {
        this.componentUri = componentUri;
        this.templateUri = templateUri;
        this.promotionId = promotionId;
        this.regionName = regionName;
    }

    public String getComponentUri() {
        return componentUri;
    }

    public String getTemplateUri() {
        return templateUri;
    }

    public String getPromotionId() {
        return promotionId;
    }

    public String getRegionName() {
        return regionName;
    }

    public String getAdditionalMarkup() {
        return additionalMarkup;
    }

    public void setAdditionalMarkup(String additionalMarkup) {
        this.additionalMarkup = additionalMarkup;
    }

    public boolean isExperiment() {
        return isExperiment;
    }

    public void setExperiment(boolean isExperiment) {
        this.isExperiment = isExperiment;
    }

    public boolean isVisible() {
        return isVisible;
    }

    public void setVisible(boolean isVisible) {
        this.isVisible = isVisible;
    }

    public ExperimentDimensions getExperimentDimensions() {
        return experimentDimensions;
    }

    public void setExperimentDimensions(ExperimentDimensions experimentDimensions) {
        this.experimentDimensions = experimentDimensions;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ComponentPresentation [component URI=");
        sb.append(componentUri);
        sb.append(",template URI=");
        sb.append(templateUri);
        sb.append(",is experiment=");
        sb.append(isExperiment);
        sb.append(",additional markup=");
        sb.append(additionalMarkup);
        sb.append("]");
        return sb.toString();

    }
}
