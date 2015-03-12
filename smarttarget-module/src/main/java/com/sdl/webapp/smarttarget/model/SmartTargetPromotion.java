package com.sdl.webapp.smarttarget.model;

import com.sdl.webapp.common.api.model.Entity;
import com.sdl.webapp.common.api.model.entity.AbstractEntity;

import java.util.*;

/**
 * SmartTarget Promotion
 * Is a DXA entity which holds promotion data + the different promotion items
 *
 * @author nic
 */
public class SmartTargetPromotion extends AbstractEntity {

    List<Entity> items = new ArrayList<>();
    boolean isExperiment = false;

    public SmartTargetPromotion(String regionName, String promotionId, boolean isExperiment) {
        this.setId(promotionId);
        this.isExperiment = isExperiment;
        this.setMvcData(new SmartTargetPromotionMvcData(regionName));
        this.setEntityData(new HashMap<String, String>());
        this.setPropertyData(new HashMap<String, String>());
    }

    public void addItem(Entity item) {
        this.items.add(item);
    }

    public List<Entity> getItems() {
        return this.items;
    }

    public boolean isExperiment() {
        return isExperiment;
    }
}
