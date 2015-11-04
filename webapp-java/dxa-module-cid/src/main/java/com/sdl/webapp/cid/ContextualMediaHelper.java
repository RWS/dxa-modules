package com.sdl.webapp.cid;

import com.sdl.webapp.common.api.MediaHelper;
import com.sdl.webapp.common.impl.GenericMediaHelper;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/**
 * Contextual Media Helper.
 * Implementation of {@link MediaHelper} for when Contextual Image Delivery is used.
 */
@Component
@Primary
public class ContextualMediaHelper extends GenericMediaHelper {

    @Override
    public String getResponsiveImageUrl(String url, String widthFactor, double aspect, int containerSize) {
        final int width = roundWidth(getResponsiveWidth(widthFactor, containerSize));

        // Height is calculated from the aspect ratio (0 means preserve aspect ratio)
        final String height = aspect == 0.0 ? "" : Integer.toString((int) Math.ceil(width / aspect));

        return String.format("/cid/scale/%dx%s/source/site%s", width, height, url);
    }
}
