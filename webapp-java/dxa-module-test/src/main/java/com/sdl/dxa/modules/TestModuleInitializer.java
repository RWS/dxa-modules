package com.sdl.dxa.modules;

import ams.com.sdl.dxa.modules.model.article.Article;
import com.sdl.dxa.modules.model.ecl.EclTest;
import com.sdl.dxa.modules.model.embed.EmbedChild;
import com.sdl.dxa.modules.model.embed.EmbedParent;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import org.springframework.stereotype.Component;

@Component
@RegisteredViewModels({
        // https://jira.sdl.com/browse/TSI-1619
        @RegisteredViewModel(viewName = "Article", modelClass = Article.class),

        // https://jira.sdl.com/browse/TSI-1675
        @RegisteredViewModel(viewName = "EmbedParent", modelClass = EmbedParent.class),
        @RegisteredViewModel(modelClass = EmbedChild.class),

        @RegisteredViewModel(viewName = "TestFlickrImage", modelClass = EclTest.class)
})
public class TestModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Test";
    }
}
