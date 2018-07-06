package com.sdl.dxa.modules.ish.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Used for wrapping exceptions related to parsing / writing html.
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class HtmlProcessingException extends RuntimeException {

    /**
     * Creates new instance of HtmlProcessingException.
     * @param message Message
     */
    public HtmlProcessingException(String message) {
        super(message);
    }

    /**
     * Creates new instance of HtmlProcessingException.
     * @param message Message
     * @param cause Original exception
     */
    public HtmlProcessingException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Creates new instance of HtmlProcessingException.
     * @param cause Original exception
     */
    public HtmlProcessingException(Throwable cause) {
        super(cause);
    }
}
