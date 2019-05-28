package com.sdl.dxa.modules.docs.mashup;

import com.sdl.dxa.modules.docs.mashup.models.products.Bicycle;
import com.sdl.dxa.modules.docs.mashup.models.widgets.DynamicWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.StaticWidget;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@SuppressWarnings("unused")
@Configuration
@ComponentScan("com.sdl.dxa.modules.docs.mashup")
@Profile("!cil.providers.active")
public class TridionDocsMashupViewsInitializer {

    @RegisteredViewModels({
        @RegisteredViewModel(viewName = "StaticWidget", modelClass = StaticWidget.class, controllerName = "TridionDocsMashup"),
        @RegisteredViewModel(viewName = "DynamicWidget", modelClass = DynamicWidget.class, controllerName = "TridionDocsMashup"),
        @RegisteredViewModel(viewName = "Bicycle", modelClass = Bicycle.class),
        @RegisteredViewModel(viewName = "Topic", modelClass = Topic.class),
        @RegisteredViewModel(viewName = "Bicycle", modelClass = RegionModelImpl.class),
        @RegisteredViewModel(viewName = "Topics", modelClass = RegionModelImpl.class)})
    @ModuleInfo(name = "DXA Modules - Tridion Docs Mashup", areaName = "TridionDocsMashup", description = "Implementation of DXA Tridion Docs Mashup module")
    @Component
    public class TridionDocsMashupModuleInitializer extends AbstractModuleInitializer {

        @Override
        protected String getAreaName() {
                return "TridionDocsMashup";
            }
    }
}
