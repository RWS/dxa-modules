package com.sdl.dxa.modules.search;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.model.entity.Link;
import org.springframework.stereotype.Component;

@Component
@RegisteredView(viewName = "SearchBox", clazz = Link.class)
public class SearchModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Search";
    }
}
