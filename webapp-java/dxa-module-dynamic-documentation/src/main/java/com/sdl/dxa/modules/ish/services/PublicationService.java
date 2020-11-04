package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URLEncoder;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public interface PublicationService {
    static final Logger LOG = LoggerFactory.getLogger(PublicationService.class);
    static final Pattern PRODUCT_FAMILY_PATTERN = Pattern.compile("(.*)\\s(\\(.+\\))");

    List<Publication> getPublicationList(Localization localization);

    void checkPublicationOnline(int publicationId, Localization localization) throws NotFoundException;

    /**
     * Product family is something that gets in brackets after the name.
     * For instance in 'Caterpillar CP-130 (Heavy industrial vehicle)' the
     * family name is 'Heavy industrial vehicle'. So in order to encode it we
     * do not have to touch the brackets and a space berofe them.
     * @param valueArg the publication title (with/without) family product name
     * @return encoded title. In case family name exists, the space and brackets
     * are left as the are.
     */
    default String getEncodedProductFamily(String valueArg) {
        if (valueArg == null) return null;
        String value = valueArg;
        try {
            Matcher matcher = PRODUCT_FAMILY_PATTERN.matcher(valueArg);
            if (matcher.find()) {
                value = URLEncoder.encode(matcher.group(1).trim(), "UTF-8") + " " + matcher.group(2);
            } else {
                value = URLEncoder.encode(value.trim(), "UTF-8");
            }
        } catch (Exception ex) {
            LOG.error("Could not encode [" + valueArg + "] to UTF-8. Not a standard JVM?", ex);
            throw new IllegalStateException(ex);
        }
        LOG.debug("Encoded '{}' -> '{}'", valueArg, value);
        return value;
    }
}
