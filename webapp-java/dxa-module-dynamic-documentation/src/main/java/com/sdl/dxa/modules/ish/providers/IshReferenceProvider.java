package com.sdl.dxa.modules.ish.providers;

import com.sdl.webapp.common.api.content.ContentProviderException;
import com.tridion.meta.Item;


/**
 * Provider to fetch meta information.
 */
public interface IshReferenceProvider {
    /**
     * Meta field name which is common for every publication which contains a topic.
     */
    public static final String REF_FIELD_NAME = "ishlogicalref.object.id";
    //private static final String DEFAULT_PUBLISH_DATA = "1900-01-01 00:00:00.000";

    Item getPageIdByIshLogicalReference(Integer publicationId, String ishLogicalRefValue) throws ContentProviderException;
}
