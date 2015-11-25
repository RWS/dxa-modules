package com.sdl.dxa.modules.search;

import com.sdl.dxa.modules.search.model.SearchBox;
import com.sdl.dxa.modules.search.model.SearchItem;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "SearchBox", clazz = SearchBox.class),
        @RegisteredView(viewName = "SearchItem", clazz = SearchItem.class),
        @RegisteredView(viewName = "SearchResults", clazz = SearchQuery.class, controllerName = "Search")
})
public class SearchModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Search";
    }
}
