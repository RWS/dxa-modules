package com.sdl.dxa.modules.ish.factory;

import com.sdl.web.api.dynamic.WebComponentPresentationAssembler;

/**
 * Create new WebComponentPresentationAssembler.
 */
public interface WebComponentPresentationAssemblerFactory {
    /**
     * Returns WebComponentPresentationAssembler.
     * @param publicationId publication ID
     * @return WebComponentPresentationAssembler
     */
    WebComponentPresentationAssembler getWebComponentPresentationAssembler(int publicationId);
}
