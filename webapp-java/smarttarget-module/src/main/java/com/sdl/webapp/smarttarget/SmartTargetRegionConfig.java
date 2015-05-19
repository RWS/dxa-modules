package com.sdl.webapp.smarttarget;

import java.util.Map;

/**
 * SmartTargetRegionConfig
 *
 * @author nic
 */
public class SmartTargetRegionConfig {

    private String regionName;
    private int maxItems;
    private AllowDuplicatesValue allowDuplicates;

    public enum AllowDuplicatesValue {
        USE_CONFIGURATION,
        ALLOW,
        DISALLOW;

        public static AllowDuplicatesValue fromString(String value) {
            if ( value == null ) {
                return DISALLOW;
            }
            if ( value.equalsIgnoreCase("Use configuration") ) {
                return USE_CONFIGURATION;
            }
            else if ( value.equalsIgnoreCase("Yes") ) {
                return ALLOW;
            }
            else {
                return DISALLOW;
            }
        }
    }

    public SmartTargetRegionConfig(Map<String,String> configData) {
        this.regionName = configData.get("regionName");
        this.maxItems = Integer.parseInt(configData.get("maxItems"));
        this.allowDuplicates = AllowDuplicatesValue.fromString(configData.get("allowDuplicates"));
    }

    public String getRegionName() {
        return regionName;
    }

    public int getMaxItems() {
        return maxItems;
    }

    public AllowDuplicatesValue getAllowDuplicates() {
        return allowDuplicates;
    }
}
