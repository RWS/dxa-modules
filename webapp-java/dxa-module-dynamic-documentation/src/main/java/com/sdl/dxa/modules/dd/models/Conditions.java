package com.sdl.dxa.modules.dd.models;

import java.util.List;
import java.util.Map;

public class Conditions {
    private int publicationId;
    private Map<String, List> userConditions;

    public int getPublicationId() {
        return publicationId;
    }

    public void setPublicationId(int publicationId) {
        this.publicationId = publicationId;
    }

    public Map<String, List> getUserConditions() {
        return userConditions;
    }

    public void setUserConditions(Map<String, List> userConditions) {
        this.userConditions = userConditions;
    }
}
