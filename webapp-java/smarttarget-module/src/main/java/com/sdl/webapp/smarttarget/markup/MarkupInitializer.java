package com.sdl.webapp.smarttarget.markup;

import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import com.sdl.webapp.smarttarget.SmartTargetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * MarkupInitializer
 *
 * @author nic
 */
@Component
public class MarkupInitializer {

    @Autowired
    private MarkupDecoratorRegistry registry;

    @Autowired
    private SmartTargetService smartTargetService;

    @PostConstruct
    public void initializeMarkup() {

        SmartTargetRegionXpmMarkup regionXpmMarkup = new SmartTargetRegionXpmMarkup();
        SmartTargetPromotionXpmMarkup promotionXpmMarkup = new SmartTargetPromotionXpmMarkup(this.smartTargetService);

        this.registry.registerDecorator("Region", regionXpmMarkup);
        this.registry.registerDecorator("Regions", regionXpmMarkup);
        this.registry.registerDecorator("Entity", promotionXpmMarkup);
        this.registry.registerDecorator("Entities", promotionXpmMarkup);
    }
}
