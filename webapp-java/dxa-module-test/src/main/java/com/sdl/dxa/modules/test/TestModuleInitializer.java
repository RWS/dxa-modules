package com.sdl.dxa.modules.test;

import com.sdl.dxa.modules.test.model.CustomPageModelImpl;
import com.sdl.dxa.modules.test.model.CustomRegionModelImpl;
import com.sdl.dxa.modules.test.model.ExternalContentLibraryStubSchemaflickr;
import com.sdl.dxa.modules.test.model.VimeoVideo;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import com.sdl.webapp.common.api.model.entity.Article;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "VimeoVideo", clazz = VimeoVideo.class),
        @RegisteredView(viewName = "ShowClaims", clazz = Article.class),
        @RegisteredView(viewName = "ShowClaims", clazz = Article.class),
        @RegisteredView(viewName = "GeneralPageCustomRegion", clazz = CustomPageModelImpl.class),
        @RegisteredView(viewName = "CustomPageMetadata", clazz = CustomPageModelImpl.class),
        @RegisteredView(viewName = "CustomRegion", clazz = CustomRegionModelImpl.class),
        @RegisteredView(viewName = "TestRegionView", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "ExternalContentLibraryStubSchemaflickr", clazz = ExternalContentLibraryStubSchemaflickr.class)
})
public class TestModuleInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Test";
    }
}
