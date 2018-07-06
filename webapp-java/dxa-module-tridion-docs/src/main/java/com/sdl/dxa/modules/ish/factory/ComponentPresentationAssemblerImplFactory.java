package com.sdl.dxa.modules.ish.factory;

import com.sdl.web.api.dynamic.ComponentPresentationAssemblerImpl;
import com.sdl.web.api.dynamic.WebComponentPresentationAssembler;
import org.springframework.stereotype.Component;

/**
 * Creates new ComponentPresentationAssemblerImpl.
 */
@Component
public class ComponentPresentationAssemblerImplFactory implements WebComponentPresentationAssemblerFactory {
    @Override
    public WebComponentPresentationAssembler getWebComponentPresentationAssembler(int publicationId) {
        return new ComponentPresentationAssemblerImpl(publicationId);
    }
}
