package com.sdl.delivery.ish.webapp.module.providers;

import com.sdl.webapp.common.api.content.ContentProviderException;

/**
 * Thrown when Content Provider not able to retrieve binary content.
 */
public class BinaryNotFoundException extends ContentProviderException {

    public BinaryNotFoundException() {
    }

    public BinaryNotFoundException(String message) {
        super(message);
    }

    public BinaryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public BinaryNotFoundException(Throwable cause) {
        super(cause);
    }

    public BinaryNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
