package com.sdl.dxa.modules.ugc;

import com.sdl.delivery.ugc.client.comment.UgcCommentApi;
import com.sdl.delivery.ugc.client.comment.impl.DefaultUgcCommentApi;
import com.sdl.dxa.modules.ugc.model.entity.UgcComments;
import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import com.sdl.dxa.modules.ugc.model.entity.UgcRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * <p>Ugc Module initializer which initializes
 * views registration in modules with {@link RegisteredViewModel} and {@link RegisteredViewModels}.
 *</p>
 */
@Slf4j
@Configuration
@ComponentScan("com.sdl.dxa.modules.ugc")
public class UgcInitializer {

    @Bean
    public UgcCommentApi ugcCommentApi() {
        return new DefaultUgcCommentApi();
    }

    //Todo: use UgcVoteCommentApi implementation when it becomes available

    @Component
    @RegisteredViewModels({
            @RegisteredViewModel(viewName = "Comments", modelClass = UgcRegion.class),
            @RegisteredViewModel(viewName = "UgcComments", modelClass = UgcComments.class),
            @RegisteredViewModel(viewName = "UgcPostCommentForm", modelClass = UgcPostCommentForm.class, controllerName = "Ugc"),
            @RegisteredViewModel(viewName = "GeneralPage", modelClass = DefaultPageModel.class)
    })
    @ModuleInfo(name = "UGC module", areaName = "Ugc", description = "Support for UGC views")
    public static class UgcViewModuleInitializer extends AbstractModuleInitializer {
        @Override
        protected String getAreaName() {
            return "Ugc";
        }
    }
}
