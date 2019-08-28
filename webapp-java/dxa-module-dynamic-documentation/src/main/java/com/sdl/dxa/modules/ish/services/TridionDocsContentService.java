package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.providers.IshReferenceProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.tridion.meta.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Services related to retrieval of content using IshContentProvider.
 */
@Service
public class TridionDocsContentService {

    @Autowired
    private IshReferenceProvider ishReferenceProvider;

    /**
     * Returns page Id in given publication, which ishLogicalRef equals to given reference value.
     *
     * @param publicationId target publication Id where to look for ishlogicalref
     * @param isLogicalReferenceValue value of meta field 'ishlogicalref.object.id'. It is supposed
     *                                that that field is common for topic which is used in different
     *                                publications
     * @return page Id of topic in given publication
     * @throws          ContentProviderException in case if data retrieving fails
     */
    public Item getPageIdByIshLogicalReference(Integer publicationId, String isLogicalReferenceValue)
            throws ContentProviderException {
        return ishReferenceProvider.getPageIdByIshLogicalReference(publicationId, isLogicalReferenceValue);
    }
}
