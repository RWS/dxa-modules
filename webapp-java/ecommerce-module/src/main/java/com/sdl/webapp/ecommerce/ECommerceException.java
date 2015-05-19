package com.sdl.webapp.ecommerce;

/**
 * ECommerce Exception
 *
 * @author nic
 */
public class ECommerceException extends Exception {

    public ECommerceException(String message) {
        super(message);
    }

    public ECommerceException(String message, Throwable cause) {
        super(message, cause);
    }

    public ECommerceException(Throwable cause) {
        super(cause);
    }

    public ECommerceException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
