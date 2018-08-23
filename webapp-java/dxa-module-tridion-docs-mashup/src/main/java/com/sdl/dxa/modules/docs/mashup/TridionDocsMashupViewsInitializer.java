package com.sdl.dxa.modules.docs.mashup;


import com.sdl.dxa.modules.docs.mashup.models.widgets.StaticWidget;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.stereotype.Component;

@SuppressWarnings("unused")
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "StaticWidget", modelClass = StaticWidget.class, controllerName = "TridionDocsMashup" )
})
@ModuleInfo(name = "DXA Modules - Tridion Docs Content Mashup", areaName = "TridionDocsMashup", description = "Implementation of DXA Tridion Docs Content Mashup module")
@Component
public class TridionDocsMashupViewsInitializer extends AbstractModuleInitializer {
    @Override
    protected String getAreaName() {
        return "TridionDocsMashup";
    }
}
