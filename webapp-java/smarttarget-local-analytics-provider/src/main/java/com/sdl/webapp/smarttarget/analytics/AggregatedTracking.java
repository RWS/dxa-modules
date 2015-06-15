package com.sdl.webapp.smarttarget.analytics;

import java.util.Date;

/**
 * AggregatedTracking
 *
 * @author nic
 */
public class AggregatedTracking {

    private String experimentId;
    private int publicationId;
    private int publicationTargetId;
    private int componentId;
    private int componentTemplateId;
    private int pageId;
    private String region;
    private int chosenVariant;
    private ExperimentType type;
    private Date date;
    private int count = 0;

    public AggregatedTracking(TrackedExperiment trackedExperiment) {
        this(   trackedExperiment.getExperimentDimensions().getExperimentId(),
                trackedExperiment.getPublicationId(),
                trackedExperiment.getPublicationTargetId(),
                trackedExperiment.getComponentId(),
                trackedExperiment.getComponentTemplateId(),
                trackedExperiment.getPageId(),
                trackedExperiment.getExperimentDimensions().getRegion(),
                trackedExperiment.getExperimentDimensions().getChosenVariant(),
                trackedExperiment.getType());
    }

    public AggregatedTracking(String experimentId,
                              int publicationId,
                              int publicationTargetId,
                              int componentId,
                              int componentTemplateId,
                              int pageId,
                              String region,
                              int chosenVariant,
                              ExperimentType type) {
        this.experimentId = experimentId;
        this.publicationId = publicationId;
        this.publicationTargetId = publicationTargetId;
        this.componentId = componentId;
        this.componentTemplateId = componentTemplateId;
        this.pageId = pageId;
        this.region = region;
        this.chosenVariant = chosenVariant;
        this.type = type;
        this.date = new Date();
    }

    public AggregatedTracking(String experimentId,
                              int publicationId,
                              int publicationTargetId,
                              int componentId,
                              int componentTemplateId,
                              int pageId,
                              String region,
                              int chosenVariant,
                              ExperimentType type,
                              Date date,
                              int count) {
        this.experimentId = experimentId;
        this.publicationId = publicationId;
        this.publicationTargetId = publicationTargetId;
        this.componentId = componentId;
        this.componentTemplateId = componentTemplateId;
        this.pageId = pageId;
        this.region = region;
        this.chosenVariant = chosenVariant;
        this.type = type;
        this.date = date;
        this.count = count;
    }


    public String getExperimentId() {
        return experimentId;
    }

    public int getPublicationId() {
        return publicationId;
    }

    public int getPublicationTargetId() {
        return publicationTargetId;
    }

    public int getComponentId() {
        return componentId;
    }

    public int getComponentTemplateId() {
        return componentTemplateId;
    }

    public String getRegion() {
        return region;
    }

    public int getPageId() {
        return pageId;
    }

    public int getChosenVariant() {
        return chosenVariant;
    }

    public ExperimentType getType() {
        return type;
    }

    public Date getDate() {
        return date;
    }
    public int getCount() {
        return count;
    }

    public synchronized void increaseCount() {
        this.count++;
    }

    public boolean canAggregate(TrackedExperiment trackedExperiment) {

        return
                trackedExperiment.getExperimentDimensions().getExperimentId().equals(this.experimentId) &&
                trackedExperiment.getPublicationId() == this.publicationId &&
                trackedExperiment.getPublicationTargetId() == this.publicationTargetId &&
                trackedExperiment.getComponentId() == this.componentId &&
                trackedExperiment.getComponentTemplateId() == this.componentTemplateId &&
                trackedExperiment.getPageId() == this.pageId &&
                trackedExperiment.getExperimentDimensions().getRegion().equals(this.region) &&
                trackedExperiment.getType() == this.type &&
                trackedExperiment.getExperimentDimensions().getChosenVariant() == this.chosenVariant;

    }

    @Override
    public String toString() {
        return "AggregatedTracking{" +
                "experimentId='" + experimentId + '\'' +
                ", publicationId=" + publicationId +
                ", publicationTargetId=" + publicationTargetId +
                ", componentId=" + componentId +
                ", componentTemplateId=" + componentTemplateId +
                ", pageId=" + pageId +
                ", region='" + region + '\'' +
                ", chosenVariant=" + chosenVariant +
                ", type=" + type +
                ", date=" + date +
                ", count=" + count +
                '}';
    }


}
