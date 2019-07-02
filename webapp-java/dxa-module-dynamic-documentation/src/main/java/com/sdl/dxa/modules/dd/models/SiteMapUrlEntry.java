package com.sdl.dxa.modules.dd.models;

import org.joda.time.DateTime;

public class SiteMapUrlEntry {
    private String url;
    private DateTime lastModifiedDate;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public DateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}
