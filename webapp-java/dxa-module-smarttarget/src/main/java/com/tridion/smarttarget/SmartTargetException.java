package com.tridion.smarttarget;

/**
 * This class is holder only. It's used instead of smartarget_core one
 * in order to compile. It's deprecated because we have to remove it after
 * moving to cil version 11.
 */
@Deprecated
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
