package com.sdl.dxa.modules.example.api.localization;

import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.localization.LocalizationNotResolvedException;
import com.sdl.webapp.common.api.localization.UnknownLocalizationHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.servlet.ServletRequest;

@Component
@Slf4j
@Profile("dxa.test.UnknownLocalizationHandlerImpl")
public class UnknownLocalizationHandlerImpl implements UnknownLocalizationHandler {

    @Value("${dxa.modules.example.UnknownLocalizationHandler.exception}")
    private String scenario;

    public Localization handleUnknown(Exception exception, ServletRequest request) {
        // "magically" resolve localization or return null to fallback to getFallbackException()
        log.debug("Trying to magically resolve the localization");
        return null;
    }

    public LocalizationNotResolvedException getFallbackException(Exception exception, ServletRequest request) {
        switch (scenario) {
            case "json":
                return new LocalizationNotResolvedException.WithCustomResponse("Exception with JSON", 200,
                        "{\"message\":\"Localization problem + JSON!\"}", "application/json");
            case "html":
                return new LocalizationNotResolvedException.WithCustomResponse("Exception with HTML", exception, 200,
                        "<strong>Localization problem + HTML!</strong>", "text/html");
            case "400":
                return new LocalizationNotResolvedException("Custom exception text 400!", 400);
            case "500":
                return new LocalizationNotResolvedException("Custom exception text 500!", 500);
            case "404.inline":
                return new LocalizationNotResolvedException.WithCustomResponse("Exception with inline text + 404!",
                        "Localization problem inline + 404", "text/plain");
            case "500.inline":
                return new LocalizationNotResolvedException.WithCustomResponse("Exception with inline text + 500!", 500,
                        "Localization problem inline + 500", "text/plain");
            case "custom.handler":
                return new LocalizationNotResolvedException.WithCustomResponse("Custom exception log text!", 500,
                        "Custom Exception text + 500", "text/plain");
            case "default.handling":
                return null;
        }
        return null;
    }
}
