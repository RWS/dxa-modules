package com.sdl.dxa.modules.smarttarget;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import com.sdl.webapp.common.api.model.entity.smarttarget.SmartTargetPromotion;
import com.sdl.webapp.common.api.model.entity.smarttarget.SmartTargetRegion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "SmartTargetRegion", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "2-Column", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "3-Column", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "4-Column", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "Promotion", clazz = SmartTargetPromotion.class)
})
@Slf4j
public class SmartTargetInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "SmartTarget";
    }
}
