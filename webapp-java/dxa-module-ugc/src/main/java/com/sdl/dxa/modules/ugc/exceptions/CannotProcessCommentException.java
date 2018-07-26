package com.sdl.dxa.modules.ugc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.METHOD_NOT_ALLOWED, reason = "Cannot process comment")
public class CannotProcessCommentException extends RuntimeException {
    public CannotProcessCommentException(String message, Exception cause) {
        super(message, cause);
    }

    public CannotProcessCommentException(String message) {
        super(message);
    }
}
