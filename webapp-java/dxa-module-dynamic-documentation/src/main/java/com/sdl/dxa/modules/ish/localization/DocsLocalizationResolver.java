package com.sdl.dxa.modules.ish.localization;

import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.localization.LocalizationResolver;
import com.sdl.webapp.common.api.localization.LocalizationResolverException;
import com.sdl.webapp.common.impl.localization.DocsLocalization;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

;

/**
 * Implementation of {@code LocalizationResolver} that uses the Api Client to determine the localization for a request.
 *
 * This component is annotated with @Primary so it has priority over the standard DXA LocalizationResolver.
 */
@Component
@Primary
public class DocsLocalizationResolver implements LocalizationResolver {

    private static final Logger LOG = LoggerFactory.getLogger(DocsLocalizationResolver.class);

    private final Map<String, Localization> localizations = new ConcurrentHashMap<>();

    private static Pattern DocsPattern =
            Pattern.compile("^/?(api/)?(binary/)?(page/)?(topic/)?(toc/)?(pageIdByReference/)?(conditions/)?(comments/)?(?<pubId>\\d+).*");

    /**
     * {@inheritDoc}
     */
    @Override
    public Localization getLocalization(String url) throws LocalizationResolverException {
        LOG.trace("getLocalization: {}", url);
        if (!localizations.containsKey(url)) {
            try {
                URI uri = new URI(url);
                String pubId = getPublicationId(uri.getPath());
                if (pubId == null) {
                    //Return dummy for home page
                    return new DocsLocalization();
                }
                DocsLocalization docsLocalization = new DocsLocalization();
                docsLocalization.setPublicationId(pubId);
                localizations.put(url, docsLocalization);
            } catch (URISyntaxException e) {
                throw new LocalizationResolverException("Syntax error for URL: " + url, e);
            }
        }

        return localizations.get(url);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean refreshLocalization(Localization localization) {
        if (localization == null) {
            return false;
        }
        String localizationId = localization.getId();
        if (localizations.remove(localizationId) != null) {
            LOG.debug("Removed cached localization with id: {}", localizationId);
            return true;
        }
        return false;
    }

    protected String getPublicationId(String url) {
        Matcher matcher = DocsPattern.matcher(url);
        if (matcher.matches()) {
            String pubId = matcher.group("pubId");
            return pubId;
        }
        return null;
    }
}
