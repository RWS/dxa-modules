package com.sdl.webapp.common.api.model.entity.smarttarget;

import com.sdl.webapp.common.api.mapping.SemanticMappingRegistry;
import com.sdl.webapp.common.api.model.ViewModelRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * ModelInitializer
 *
 * @author nic
 */
@Component
public class ModelInitializer {

    @Autowired
    private ViewModelRegistry viewModelRegistry;

    @PostConstruct
    public void initializeModels() {

        this.viewModelRegistry.registerViewEntityClass("SmartTarget:PromoBanner", PromoBanner.class);

    }
}
