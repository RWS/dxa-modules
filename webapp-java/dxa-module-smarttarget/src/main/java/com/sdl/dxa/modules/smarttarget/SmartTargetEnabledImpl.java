package com.sdl.dxa.modules.smarttarget;

import com.sdl.webapp.tridion.mapping.smarttarget.AbstractSmartTargetPageBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
@Slf4j
public class SmartTargetEnabledImpl implements AbstractSmartTargetPageBuilder.SmartTargetEnabled {
    @Override
    public boolean isEnabled() {
        log.debug("Setting SmartTarget profile on");
        return true;
    }
}
