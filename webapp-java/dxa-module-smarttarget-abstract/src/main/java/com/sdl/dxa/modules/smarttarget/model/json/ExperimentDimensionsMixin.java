package com.sdl.dxa.modules.smarttarget.model.json;

import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings("unused")
public interface ExperimentDimensionsMixin {
    @JsonProperty("ExperimentId")
    String getExperimentId();

    @JsonProperty("PublicationId")
    String getPublicationId();

    @JsonProperty("PageId")
    String getPageId();

    @JsonProperty("Region")
    String getRegion();

    @JsonProperty("ComponentId")
    String getComponentId();

    @JsonProperty("ComponentTemplateId")
    String getComponentTemplateId();

    @JsonProperty("ChosenVariant")
    int getChosenVariant();

    @JsonProperty("InstanceId")
    String getInstanceId();

    @JsonProperty("PublicationTargetId")
    String getPublicationTargetId();
}
