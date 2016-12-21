package com.sdl.delivery.ish.webapp.module.localization;

import com.sdl.webapp.common.api.localization.SiteLocalization;
import com.sdl.webapp.common.api.mapping.semantic.config.SemanticSchema;
import com.sdl.webapp.common.api.localization.Localization;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

import static org.dd4t.core.util.TCMURI.Namespace.ISH;

/**
 * Dita localization.
 */
public class DitaLocalization implements Localization {

    /**
     * Set the id for the current publication
     *
     * Hardcoded for now.
     * Will become dynamic when the publication query api is available in CD.
     */
    @Getter @Setter public String publicationId = "1176127";

    /**
     * {@inheritDoc}
     */
    public String getId() {
        return publicationId;
    }

    /**
     * {@inheritDoc}
     */
    public String getPath() {
        return "/";
    }

    /**
     * {@inheritDoc}
     */
    public boolean isStaticContent(String url) {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isDefault() {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isStaging() {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    public String getVersion() {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public String getCulture() {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public Locale getLocale() {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public List<SiteLocalization> getSiteLocalizations() {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public String getConfiguration(String key) {
        return "";
    }

    /**
     * {@inheritDoc}
     */
    public String getResource(String key) {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public Map<Long, SemanticSchema> getSemanticSchemas() {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public List<String> getIncludes(String pageTypeId) {
        return new ArrayList();
    }

    /**
     * {@inheritDoc}
     */
    public String localizePath(String url) {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public List<String> getDataFormats() {
        return new ArrayList<String>(Arrays.asList("json"));
    }

    /**
     * {@inheritDoc}
     */
    public String getCmUriScheme() {
        return ISH.getValue();
    }
}
