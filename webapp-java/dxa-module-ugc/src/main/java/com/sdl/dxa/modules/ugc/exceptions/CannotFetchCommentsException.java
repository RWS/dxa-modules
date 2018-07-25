package com.sdl.dxa.modules.ugc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.METHOD_NOT_ALLOWED, reason = "Cannot fetch comments")
public class CannotFetchCommentsException extends RuntimeException {
    public CannotFetchCommentsException(Exception cause) {
        super(cause);
    }

    public CannotFetchCommentsException(String message, Exception cause) {
        super(message, cause);
    }
}
