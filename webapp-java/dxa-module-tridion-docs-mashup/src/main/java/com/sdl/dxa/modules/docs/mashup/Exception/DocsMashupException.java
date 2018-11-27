package com.sdl.dxa.modules.docs.mashup.Exception;

/**
 * Exception happened in docs mashup functionality.
 */
public class DocsMashupException extends Exception {
    public DocsMashupException() {
        super();
    }

    public DocsMashupException(String message) {
        super(message);
    }

    public DocsMashupException(String message, Throwable cause) {
        super(message, cause);
    }

    public DocsMashupException(Throwable cause) {
        super(cause);
    }

    protected DocsMashupException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
