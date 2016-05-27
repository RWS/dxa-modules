package com.sdl.dxa.modules;

import com.sdl.dxa.modules.model.ecl.EclTest;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import org.springframework.stereotype.Component;

@Component
@RegisteredViewModel(viewName = "TestFlickrImage", modelClass = EclTest.class)
public class TestModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Test";
    }
}
