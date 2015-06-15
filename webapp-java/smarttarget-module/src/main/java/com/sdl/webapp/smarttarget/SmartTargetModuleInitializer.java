package com.sdl.webapp.smarttarget;

import com.sdl.webapp.common.api.mapping.SemanticMappingRegistry;
import com.sdl.webapp.common.api.model.ViewModelRegistry;
import com.sdl.webapp.smarttarget.model.PromoBanner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * Smart Target Module Initializer
 *
 * @author nic
 */
@Component
public class SmartTargetModuleInitializer {

    @Autowired
    private ViewModelRegistry viewModelRegistry;

    @Autowired SemanticMappingRegistry semanticMappingRegistry;

    @PostConstruct
    public void initializeModels() {
        this.viewModelRegistry.registerViewEntityClass("SmartTarget:PromoBanner", PromoBanner.class);
        semanticMappingRegistry.registerEntity(PromoBanner.class);
    }
}
