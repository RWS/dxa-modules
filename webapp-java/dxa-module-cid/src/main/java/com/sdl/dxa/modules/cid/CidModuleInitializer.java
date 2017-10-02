package com.sdl.dxa.modules.cid;

import com.sdl.webapp.common.api.mapping.views.AbstractModuleInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
@ComponentScan("com.sdl.webapp.cid")
public class CidModuleInitializer {

    @Component
    @ModuleInfo(name = "CID module", areaName = "CidModule", description = "Spring-initialized module for CID")
    public static class CidModuleViewsInitializer extends AbstractModuleInitializer {
        @Override
        protected String getAreaName() {
            return "CidModule";
        }
    }
}
