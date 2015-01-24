package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;

import java.util.Date;

/**
 * TrackedExperiment
 *
 * @author nic
 */
public class TrackedExperiment {

    private Date date;
    private ExperimentDimensions experimentDimensions;
    private int publicationId;
    private int publicationTargetId;
    private int componentId;
    private int componentTemplateId;
    private int pageId;
    private ExperimentType type;

    public TrackedExperiment(ExperimentDimensions experimentDimensions, ExperimentType type) {
        this.experimentDimensions = experimentDimensions;
        this.date = new Date();
        this.publicationId = TcmUtils.extractItemIdFromTcmUri(experimentDimensions.getPublicationId());
        this.publicationTargetId = TcmUtils.extractItemIdFromTcmUri(experimentDimensions.getPublicationTargetId());
        this.componentId = TcmUtils.extractItemIdFromTcmUri(experimentDimensions.getComponentId());
        this.componentTemplateId = TcmUtils.extractItemIdFromTcmUri(experimentDimensions.getComponentTemplateId());
        this.pageId = TcmUtils.extractItemIdFromTcmUri(experimentDimensions.getPageId());
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public ExperimentDimensions getExperimentDimensions() {
        return experimentDimensions;
    }

    public int getPublicationId() {
        return publicationId;
    }

    public int getPublicationTargetId() {
        return publicationTargetId;
    }

    public int getComponentId() { return componentId; }

    public int getComponentTemplateId() { return componentTemplateId; }

    public int getPageId() { return pageId; }

    public ExperimentType getType() {
        return type;
    }

}
