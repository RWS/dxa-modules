package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.model.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.SmartTargetRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "SmartTargetRegion", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "2-Column", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "3-Column", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "4-Column", clazz = SmartTargetRegion.class),
        @RegisteredView(viewName = "Promotion", clazz = SmartTargetPromotion.class)
})
public class SmartTargetInitializer extends AbstractInitializer {
    @Override
    protected String getAreaName() {
        return "SmartTarget";
    }
}
