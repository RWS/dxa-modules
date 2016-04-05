package com.sdl.dxa.modules.smarttarget;

import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.TrackingRedirect;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.Servlet;

@Slf4j
public class SmartTargetWebInitializer extends AbstractSmartTargetWebInitializer {
    @Override
    protected String getTrackingRedirectUrl() {
        try {
            return AnalyticsManager.getConfiguredAnalyticsManager().getConfiguration().getTrackingRedirectUrl();
        } catch (SmartTargetException e) {
            log.warn("Failed to get analytics manager configuration", e);
            return null;
        }
    }

    @Override
    protected Class<? extends Servlet> getTrackingRedirectClass() {
        return TrackingRedirect.class;
    }
}
