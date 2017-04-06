package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Slf4j
@Configuration
@ComponentScan("com.sdl.dxa.modules.smarttarget")
public class CommonSmartTargetInitializer {
    @Autowired
    private MarkupDecoratorRegistry markupDecoratorRegistry;

    @Autowired
    private TrackingMarkupDecorator trackingMarkupDecorator;

    @PostConstruct
    public void init() {
        markupDecoratorRegistry.registerDecorator("Entity", trackingMarkupDecorator);
        markupDecoratorRegistry.registerDecorator("Entities", trackingMarkupDecorator);
    }
}
