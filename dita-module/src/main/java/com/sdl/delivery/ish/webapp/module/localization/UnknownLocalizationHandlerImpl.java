package com.sdl.delivery.ish.webapp.module.localization;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.localization.LocalizationNotResolvedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.sdl.webapp.common.api.localization.UnknownLocalizationHandler;

import javax.servlet.ServletRequest;
import static org.apache.commons.lang3.StringUtils.isNumeric;


/**
 * Unknown localization handler.
 */
@Component
@Slf4j
public class UnknownLocalizationHandlerImpl implements UnknownLocalizationHandler {

    @Autowired
    private WebRequestContext webRequestContext;

    private DitaLocalization ditaLocalization = new DitaLocalization();

    /**
     * Handle unknown localization. Happens when there is no publication mapped to the domain.
     * @param exception exception occurred during <i>normal</i> attempt to resolve localization
     * @param request   the current request
     * @return
     */
    public Localization handleUnknown(Exception exception, ServletRequest request) {
        // Parse publication id from the request
        String path = webRequestContext.getRequestPath();
        String[] params = path.split("/");
        if (params.length > 1) {
            // First parameter is the publication id (in case it is numeric)
            String firstParam = params[1];
            if (isNumeric(firstParam)) {
                ditaLocalization.setPublicationId(firstParam);
            }
        }
        return ditaLocalization;
    }

    /**
     * Fallback exception in case the dita localization also failed.
     * @param exception initial exception when failed to resolve a {@link Localization}
     * @param request   the current request
     * @return
     */
    public LocalizationNotResolvedException getFallbackException(Exception exception, ServletRequest request) {
        return new LocalizationNotResolvedException.WithCustomResponse("Exception with JSON", 200,
                "{\"message\":\"Localization problem!\"}", "application/json");
    }
}
