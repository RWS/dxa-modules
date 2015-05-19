package com.sdl.webapp.demandware.ecommerce;

import com.sdl.webapp.common.api.mapping.SemanticMappingRegistry;
import com.sdl.webapp.common.api.model.ViewModelRegistry;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.api.model.entity.GenericWidget;
import com.sdl.webapp.common.markup.PluggableMarkupRegistry;
import com.sdl.webapp.common.markup.html.builders.HtmlBuilders;
import com.sdl.webapp.demandware.ecommerce.model.ShoppingCartWidget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * DemandWareModuleInitializer
 *
 * @author nic
 */
@Component
public class DemandWareModuleInitializer {

    @Autowired
    private ViewModelRegistry viewModelRegistry;

    @Autowired
    private SemanticMappingRegistry semanticMappingRegistry;

    @Autowired
    private PluggableMarkupRegistry pluggableMarkupRegistry;

    @PostConstruct
    public void initialize() {

        this.viewModelRegistry.registerViewEntityClass("DemandWare:Category", EclItem.class);
        this.viewModelRegistry.registerViewEntityClass("DemandWare:ProductDetails", EclItem.class);
        this.viewModelRegistry.registerViewEntityClass("DemandWare:ProductDetailsWidget", GenericWidget.class);
        this.viewModelRegistry.registerViewEntityClass("DemandWare:CartMinimized", ShoppingCartWidget.class);
        this.viewModelRegistry.registerViewEntityClass("DemandWare:Cart", ShoppingCartWidget.class);

        this.semanticMappingRegistry.registerEntity(ShoppingCartWidget.class);

        pluggableMarkupRegistry.registerPluggableMarkup(PluggableMarkupRegistry.MarkupType.BOTTOM_JS,
                HtmlBuilders.element("script").withAttribute("src", "/system/assets/scripts/demandware-ecommerce.js").build());
        pluggableMarkupRegistry.registerPluggableMarkup(PluggableMarkupRegistry.MarkupType.BOTTOM_JS,
                HtmlBuilders.element("script").withAttribute("src", "/system/assets/scripts/jquery-ui.min.js").build());
    }
}
