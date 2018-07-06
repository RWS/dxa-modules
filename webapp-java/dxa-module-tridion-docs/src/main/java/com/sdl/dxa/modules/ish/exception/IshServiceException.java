package com.sdl.dxa.modules.ish.exception;


/**
 * IshServiceException class.
 */
public class IshServiceException extends RuntimeException {
    public IshServiceException() {
    }

    public IshServiceException(String message) {
        super(message);
    }

    public IshServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public IshServiceException(Throwable cause) {
        super(cause);
    }

    public IshServiceException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
