package com.tridion.smarttarget;

public class SmartTargetException extends Exception {
    public SmartTargetException() {
        super();
    }

    public SmartTargetException(String message) {
        super(message);
    }

    public SmartTargetException(String message, Throwable cause) {
        super(message, cause);
    }

    public SmartTargetException(Throwable cause) {
        super(cause);
    }

    protected SmartTargetException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
