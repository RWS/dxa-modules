package com.sdl.webapp.context;

import com.sdl.webapp.common.api.DefaultImplementation;
import com.sdl.webapp.common.api.mapping.SemanticMappingRegistry;
import com.sdl.webapp.common.api.model.ViewModelRegistry;
import com.sdl.webapp.common.controller.ViewResolver;
import com.sdl.webapp.common.markup.PluggableMarkupRegistry;
import com.sdl.webapp.common.markup.html.HtmlTextNode;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * ContextualViewsModuleInitializer
 *
 * @author nic
 */
@Component
public class ContextualViewsModuleInitializer {

    @Autowired
    private PluggableMarkupRegistry pluggableMarkupRegistry;

    @Autowired
    private ContextService contextService;

    @Autowired
    @Qualifier("defaultViewResolver")
    private DefaultImplementation<ViewResolver> defaultImplementation;

    @PostConstruct
    public void initialize() {

        defaultImplementation.override(new ContextualViewResolver(this.contextService));

        pluggableMarkupRegistry.registerPluggableMarkup(PluggableMarkupRegistry.MarkupType.CSS,
                new HtmlTextNode("<link rel=\"stylesheet\" href=\"/system/assets/css/contextprofile.css\" type=\"text/css\"/>", false));

        pluggableMarkupRegistry.registerPluggableMarkup(PluggableMarkupRegistry.MarkupType.BOTTOM_JS,
                HtmlBuilders.element("script")
                        .withAttribute("src", "/system/assets/scripts/contextprofile.js")
                        .build());
    }
}
