package com.sdl.webapp.context.markup;

import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import com.sdl.webapp.context.ContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * MarkupInitializer
 *
 * @author nic
 */
@Component
public class ContextMarkupInitializer {

    @Autowired
    private MarkupDecoratorRegistry registry;

    @Autowired
    private ContextService contextService;


    @PostConstruct
    public void initializeMarkup() {

        ContextProfileEntityMarkup entityMarkup = new ContextProfileEntityMarkup(contextService);

        this.registry.registerDecorator("Entity", entityMarkup);
        this.registry.registerDecorator("Entities", entityMarkup);
    }
}
