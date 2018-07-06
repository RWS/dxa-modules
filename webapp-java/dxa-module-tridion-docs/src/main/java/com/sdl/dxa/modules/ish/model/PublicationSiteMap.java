package com.sdl.dxa.modules.ish.model;

import java.util.ArrayList;
import java.util.List;

import static java.util.Collections.unmodifiableList;

/**
 * PublicationSiteMap.
 */
public class PublicationSiteMap {
    private int publicationId;
    private int namespaceId;
    private List<SiteMapURLEntry> urls;

    public PublicationSiteMap(int publicationId, int namespaceId) {
        this.publicationId = publicationId;
        this.namespaceId = namespaceId;
        this.urls = new ArrayList<>();
    }

    /**
     * Publication Identifier for this SiteMap.
     *
     * @return publication Identifier.
     */
    public int getPublicationId() {
        return publicationId;
    }

    /**
     * Namespace Idenfier for this SiteMap.
     *
     * @return Namespace Id.
     */
    public int getNamespaceId() {
        return namespaceId;
    }

    /**
     * List of URLEntries in this SiteMap.
     *
     * @return List of SiteMapURLEntry.
     */
    public List<SiteMapURLEntry> getUrlEntryList() {
        return unmodifiableList(urls);
    }

    /**
     * Add new site map url entry.
     *
     * @param urlEntry new site map url entry
     */
    public void addUrlEntry(SiteMapURLEntry urlEntry) {
        urls.add(urlEntry);
    }
}
