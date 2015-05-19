package com.sdl.webapp.context;

/**
 * Context Service
 *
 * @author nic
 */
public interface ContextService {

    /**
     * Get context profile for current request
     *
     * @return context profile
     */
    ContextProfile getContextProfile();

}
