package com.sdl.dxa.modules.ish;

import com.sdl.dxa.modules.ish.model.Topic;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

/**
 * DXA Initializer for ish module.
 */
@Component
@ComponentScan("com.sdl.delivery.ish.webapp.module")
@RegisteredViewModels({
        @RegisteredViewModel(viewName = "GeneralPage", modelClass = DefaultPageModel.class),
        @RegisteredViewModel(viewName = "Main", modelClass = RegionModelImpl.class),
        @RegisteredViewModel(viewName = "Topic", modelClass = Topic.class)
})
@ModuleInfo(name = "Ish module", areaName = "Ish", description = "Ish DXA module which contains basic views")
public class IshModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Ish";
    }
}
