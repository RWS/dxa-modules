package com.sdl.dxa.modules.search;

import com.sdl.webapp.common.api.model.entity.Link;
import com.sdl.webapp.common.impl.AbstractInitializer;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class SearchModuleInitializer extends AbstractInitializer {

    @PostConstruct
    public void initialize() {
        // TODO: Implement this for real, currently this is just a dummy implementation to avoid errors

        this.registerViewModel("SearchBox", Link.class);

    }

    @Override
    protected String getAreaName() {
        return "Search";
    }
}
