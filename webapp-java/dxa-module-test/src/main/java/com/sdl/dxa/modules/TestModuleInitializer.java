package com.sdl.dxa.modules;

import ams.com.sdl.dxa.modules.model.article.Article;
import com.sdl.dxa.modules.model.TSI1757.Tsi1757TestEntity1;
import com.sdl.dxa.modules.model.TSI1757.Tsi1757TestEntity2;
import com.sdl.dxa.modules.model.TSI1757.Tsi1757TestEntity3;
import com.sdl.dxa.modules.model.TSI1758.Tsi1758TestEmbedded2Entity;
import com.sdl.dxa.modules.model.TSI1758.Tsi1758TestEmbeddedEntity;
import com.sdl.dxa.modules.model.TSI1758.Tsi1758TestEntity;
import com.sdl.dxa.modules.model.TSI1946.Tsi1946TestEntity;
import com.sdl.dxa.modules.model.TSI811.Tsi811PageModel;
import com.sdl.dxa.modules.model.TSI811.Tsi811TestEntity;
import com.sdl.dxa.modules.model.TSI811.Tsi811TestKeyword;
import com.sdl.dxa.modules.model.ecl.EclTest;
import com.sdl.dxa.modules.model.embed.EmbedChild;
import com.sdl.dxa.modules.model.embed.EmbedParent;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import org.springframework.stereotype.Component;

@Component
@RegisteredViewModels({
        // https://jira.sdl.com/browse/TSI-1619
        @RegisteredViewModel(viewName = "Article", modelClass = Article.class),

        // https://jira.sdl.com/browse/TSI-1675
        @RegisteredViewModel(viewName = "EmbedParent", modelClass = EmbedParent.class),
        @RegisteredViewModel(modelClass = EmbedChild.class),

        @RegisteredViewModel(viewName = "TestFlickrImage", modelClass = EclTest.class),

        // https://jira.sdl.com/browse/TSI-1758
        @RegisteredViewModel(viewName = "TSI1758Test", modelClass = Tsi1758TestEntity.class),
        @RegisteredViewModel(viewName = "TSI1758TestEmbedded", modelClass = Tsi1758TestEmbeddedEntity.class),
        @RegisteredViewModel(viewName = "TSI1758TestEmbedded2", modelClass = Tsi1758TestEmbedded2Entity.class),
        @RegisteredViewModel(viewName = "SimpleTestPage", modelClass = DefaultPageModel.class),

        // https://jira.sdl.com/browse/TSI-1947
        @RegisteredViewModel(viewName = "TSI1947Test", modelClass = Article.class),

        // https://jira.sdl.com/browse/TSI-811
        @RegisteredViewModel(viewName = "TSI811TestPage", modelClass = Tsi811PageModel.class),
        @RegisteredViewModel(viewName = "TSI811Test", modelClass = Tsi811TestEntity.class),
        @RegisteredViewModel(modelClass = Tsi811TestKeyword.class),

        // https://jira.sdl.com/browse/TSI-1946
        @RegisteredViewModel(viewName = "TSI1946Test", modelClass = Tsi1946TestEntity.class),

        // https://jira.sdl.com/browse/TSI-1757
        @RegisteredViewModel(viewName = "TSI1757Test3", modelClass = Tsi1757TestEntity3.class),
        @RegisteredViewModel(modelClass = Tsi1757TestEntity1.class),
        @RegisteredViewModel(modelClass = Tsi1757TestEntity2.class)
})
public class TestModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Test";
    }
}
