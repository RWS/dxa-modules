package com.sdl.webapp.smarttarget.model;

import com.sdl.webapp.common.api.model.MvcData;

import java.util.Collections;
import java.util.Map;

/**
 * SmartTarget Promotion MVC Data
 *
 * @author nic
 */
public class SmartTargetPromotionMvcData implements MvcData {

    static String CORE_AREA_NAME = "Core";
    private String ENTITY_CONTROLLER_NAME = "Entity";
    private String ENTITY_ACTION_NAME = "Entity";
    private String SMARTTARGET_AREA_NAME = "SmartTarget";
    private String PROMOTION_VIEW_NAME = "Promotion";

    private String regionName;
    private Map<String,Object> metadata = Collections.emptyMap();
    private Map<String,String> routeValues = Collections.emptyMap();

    public SmartTargetPromotionMvcData(String regionName) {
        this.regionName = regionName;
    }

    @Override
    public String getControllerAreaName() {
        return CORE_AREA_NAME;
    }

    @Override
    public String getControllerName() {
        return ENTITY_CONTROLLER_NAME;
    }

    @Override
    public String getActionName() {
        return ENTITY_ACTION_NAME;
    }

    @Override
    public String getAreaName() {
        return SMARTTARGET_AREA_NAME;
    }

    @Override
    public String getViewName() {
        return PROMOTION_VIEW_NAME;
    }

    @Override
    public String getRegionAreaName() {
        return CORE_AREA_NAME;
    }

    @Override
    public String getRegionName() {
        return this.regionName;
    }

    @Override
    public Map<String, String> getRouteValues() {
        return routeValues;
    }

    @Override
    public Map<String, Object> getMetadata() {
        return metadata;
    }
}
