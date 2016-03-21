package com.sdl.dxa.core;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelView;
import com.sdl.webapp.common.api.model.entity.ViewNotFoundEntityError;
import org.springframework.stereotype.Component;

@Component
@RegisteredModelView(viewName = "ViewNotFoundError", modelClass = ViewNotFoundEntityError.class, controllerName = "Error")
@ModuleInfo(name = "Core/Error Module", areaName = "Shared", description = "Initializer of Shared views")
//todo dxa2 rename to SharedInitializer?
public class ErrorsInitializer extends AbstractInitializer {
    @Override
    protected String getAreaName() {
        return "Shared";
    }
}
