package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.webapp.common.api.localization.Localization;

public interface SitemapService {
    String createSitemap(String contextPath, Localization localization) throws IshServiceException;
}
