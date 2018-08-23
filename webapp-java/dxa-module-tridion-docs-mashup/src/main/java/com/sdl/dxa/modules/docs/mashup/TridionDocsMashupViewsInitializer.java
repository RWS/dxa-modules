package com.sdl.dxa.modules.docs.mashup;


import com.sdl.dxa.modules.docs.mashup.models.products.Bicycle;
import com.sdl.dxa.modules.docs.mashup.models.widgets.DynamicWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.StaticWidget;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.stereotype.Component;

@SuppressWarnings("unused")
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "StaticWidget", modelClass = StaticWidget.class, controllerName = "TridionDocsMashup" ),
        @RegisteredViewModel(viewName = "DynamicWidget", modelClass = DynamicWidget.class, controllerName = "TridionDocsMashup" ),
        @RegisteredViewModel(viewName = "Bicycle", modelClass = Bicycle.class ),
        @RegisteredViewModel(viewName = "DynamicWidget", modelClass = RegionModelImpl.class )
})
@ModuleInfo(name = "DXA Modules - Tridion Docs Mashup", areaName = "TridionDocsMashup", description = "Implementation of DXA Tridion Docs Mashup module")
@Component
public class TridionDocsMashupViewsInitializer extends AbstractModuleInitializer {
    @Override
    protected String getAreaName() {
        return "TridionDocsMashup";
    }
}
