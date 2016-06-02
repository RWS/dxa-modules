package com.sdl.dxa.modules;

import alina.sdl.dxa.modules.model.article.Article;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import org.springframework.stereotype.Component;

@Component
@RegisteredViewModel(viewName = "NestedArticleTest", modelClass = Article.class)
public class ArticleModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Test";
    }
}

