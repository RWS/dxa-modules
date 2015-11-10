package com.sdl.dxa.modules.search;

import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.impl.AbstractInitializer;
import org.springframework.stereotype.Component;

@Component
public class SearchModuleInitializer extends AbstractInitializer {

    @Override
    protected boolean registerModule() {
        this.registerViewModel("SearchBox", Link.class);
        return true;
    }

    @Override
    protected String getAreaName() {
        return "Search";
    }
}
