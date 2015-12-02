package com.sdl.dxa.modules.search.provider.implementation;

import com.sdl.dxa.modules.search.provider.SearchProvider;
import com.sdl.webapp.common.api.localization.Localization;

public abstract class AbstractSearchProvider implements SearchProvider {

    protected String getServiceUrl(Localization localization) {
        return localization.getConfiguration("search." + (localization.isStaging() ? "staging" : "live") + "IndexConfig");
    }
}
