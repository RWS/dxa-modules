package com.sdl.dxa.modules.search;

import com.sdl.webapp.common.exceptions.DxaException;

public class DxaSearchException extends DxaException {

    public DxaSearchException(String message, Exception innerException) {
        super(message, innerException);
    }

    public DxaSearchException(String message) {
        super(message);
    }

    public DxaSearchException(Throwable cause) {
        super(cause);
    }
}
