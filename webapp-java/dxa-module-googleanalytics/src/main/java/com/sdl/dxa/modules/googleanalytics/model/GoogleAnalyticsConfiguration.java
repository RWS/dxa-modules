package com.sdl.dxa.modules.googleanalytics.model;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

@SemanticEntity(entityName = "GoogleAnalyticsConfiguration", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
public class GoogleAnalyticsConfiguration extends AbstractEntityModel {

    @SemanticProperty("siteKey")
    private String siteKey;

    public String getSiteKey() {
        return siteKey;
    }
}
