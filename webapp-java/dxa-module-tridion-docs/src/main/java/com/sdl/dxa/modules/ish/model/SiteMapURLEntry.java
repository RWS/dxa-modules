package com.sdl.dxa.modules.ish.model;

import java.util.Date;

/**
 * SiteMapURLEntry.
 */
public class SiteMapURLEntry {
    private String url;
    private Date lastModifiedDate;

    public SiteMapURLEntry(String url, Date date) {
        this.url = url;
        this.lastModifiedDate = new Date(date.getTime());
    }

    /**
     * URL of the SiteMap Entry.
     * @return URL.
     */
    public String getUrl() {
        return url;
    }

    /**
     * Last Modified Date of the entity with this URL.
     * @return Last Modified Date.
     */
    public Date getLastModifiedDate() {
        return new Date(this.lastModifiedDate.getTime());
    }
}
