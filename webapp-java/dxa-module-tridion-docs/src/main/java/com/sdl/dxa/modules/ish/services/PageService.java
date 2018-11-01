package com.sdl.dxa.modules.ish.services;

import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.PageNotFoundException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.controller.exception.InternalServerErrorException;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * Page service.
 */
@Service
public class PageService {

    @Autowired
    @Qualifier("ishContentProvider")
    private ContentProvider contentProvider;

    /**
     * Get the page model.
     *
     * @param path         Path
     * @param localization Localization
     * @return Page model for given path
     */
    public PageModel getPageModel(String path, Localization localization) {
        try {
            return contentProvider.getPageModel(path, localization);
        } catch (PageNotFoundException e) {
            throw new NotFoundException("Page not found: " + path, e);
        } catch (ContentProviderException e) {
            throw new InternalServerErrorException("An unexpected error occurred", e);
        }
    }
}
