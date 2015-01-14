package com.sdl.webapp.common.api.model.entity.smarttarget;

import com.sdl.webapp.common.api.mapping.SemanticMappingRegistry;
import com.sdl.webapp.common.api.model.ViewModelRegistry;
import com.sdl.webapp.common.api.model.entity.AbstractEntity;
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

    //@Autowired SemanticMappingRegistry semanticMappingRegistry;

    @PostConstruct
    public void initializeModels() {

        this.viewModelRegistry.registerViewEntityClass("SmartTarget:PromoBanner", PromoBanner.class);

        // TODO: Why can we not register other entities into the semantic mapping registry...???
        //semanticMappingRegistry.registerEntities(AbstractEntity.class.getPackage().getName());

    }
}
