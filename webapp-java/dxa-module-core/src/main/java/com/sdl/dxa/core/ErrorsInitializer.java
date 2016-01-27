package com.sdl.dxa.core;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.model.entity.ViewNotFoundEntityError;
import org.springframework.stereotype.Component;

@RegisteredView(viewName = "ViewNotFoundError", clazz = ViewNotFoundEntityError.class, controllerName = "Error")
@Component
public class ErrorsInitializer extends AbstractInitializer {
    @Override
    protected String getAreaName() {
        return "Shared";
    }
}
