package com.sdl.dxa.modules.dd.models;

import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

import java.util.ArrayList;
import java.util.List;

public class PublicationSiteMap extends AbstractEntityModel {
    private int publicationId;
    private int namespaceId;
    private List<SiteMapUrlEntry> urls = new ArrayList<SiteMapUrlEntry>();

    public int getPublicationId() {
        return publicationId;
    }

    public void setPublicationId(int publicationId) {
        this.publicationId = publicationId;
    }

    public int getNamespaceId() {
        return namespaceId;
    }

    public void setNamespaceId(int namespaceId) {
        this.namespaceId = namespaceId;
    }

    public List<SiteMapUrlEntry> getUrls() {
        return urls;
    }

    public void setUrls(List<SiteMapUrlEntry> urls) {
        this.urls = urls;
    }
}
