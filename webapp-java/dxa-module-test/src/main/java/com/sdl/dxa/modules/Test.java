package com.sdl.dxa.modules;

import com.sdl.dxa.modules.model.ecl.EclTest;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import org.springframework.stereotype.Component;

/**
 * Created by akeda on 5/25/2016.
 */
@Component
@RegisteredViewModel(viewName = "TestFlickrImage", modelClass = EclTest.class)
public class Test extends AbstractInitializer{

    @Override
    protected String getAreaName() {
        return "Test";
    }
}
