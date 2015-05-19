package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.analytics.CustomDimensionNames;

/**
 * SimpleCustomDimensionNames
 *
 * @author nic
 */
public class SimpleCustomDimensionNames extends CustomDimensionNames {

    public SimpleCustomDimensionNames() {
        this.setExperimentId("ExperimentId");
        this.setPageId("PageId");
        this.setComponentId("ComponentId");
        this.setComponentTemplateId("ComponentTemplateId");
        this.setPublicationId("PublicationId");
        this.setPublicationTargetId("PublicationTargetId");
        this.setRegion("Region");
        this.setChosenVariant("ChosenVariant");
    }

}
