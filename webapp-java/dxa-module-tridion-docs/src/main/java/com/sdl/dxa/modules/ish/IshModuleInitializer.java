package com.sdl.dxa.modules.ish;

import com.sdl.dxa.modules.ish.model.Topic;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * DXA Initializer for ish module.
 */
@Configuration
@ComponentScan(value = "com.sdl.dxa.modules.ish")
public class IshModuleInitializer {

    @Component
    @RegisteredViewModels({
            @RegisteredViewModel(viewName = "GeneralPage", modelClass = DefaultPageModel.class),
            @RegisteredViewModel(viewName = "Main", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Topic", modelClass = Topic.class)
    })
    @ModuleInfo(name = "Tridion Docs module", areaName = "Ish", description = "Tridion Docs DXA module which contains basic views")
    public static class IshViewModuleInitializer extends AbstractModuleInitializer {
        @Override
        protected String getAreaName() {
            return "Ish";
        }
    }
}
