package com.sdl.delivery.ish.webapp.module.model;

import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

/**
 * Model for hello world controller.
 */
public class HelloModel extends AbstractEntityModel {

    private String message = "Hello world";

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
