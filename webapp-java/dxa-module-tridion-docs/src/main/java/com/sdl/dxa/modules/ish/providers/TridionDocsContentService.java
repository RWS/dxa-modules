package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.modules.ish.localization.IshLocalization;
import com.sdl.dxa.modules.ish.utils.HtmlUtil;
import com.sdl.dxa.modules.ish.model.Topic;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.StaticContentItem;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RichText;
import com.tridion.meta.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/**
 * Services related to retrieval of content using IshContentProvider.
 */
@Service
public class TridionDocsContentService {

    @Autowired
    @Qualifier("ishContentProvider")
    private IshContentProvider contentProvider;

    @Autowired
    private IshReferenceProvider ishReferenceProvider;

    /**
     * Get binary content.
     *
     * @param publicationId Publication id
     * @param binaryId      Binary id
     * @return The binary
     * @throws ContentProviderException
     */
    public StaticContentItem getBinaryContent(Integer publicationId, Integer binaryId) throws ContentProviderException {
        return contentProvider.getBinaryContent(publicationId, binaryId);
    }

    /**
     * Get page model.
     *
     * @param pageId       Page id
     * @param localization Localization
     * @param contextPath  Context path, used for updating urls inside topic html
     * @return The page model
     * @throws ContentProviderException
     */
    public PageModel getPageModel(Integer pageId, IshLocalization localization, String contextPath)
            throws ContentProviderException {
        PageModel model = contentProvider.getPageModel(Integer.toString(pageId), localization);
        // Update base path inside links in case the application is not hosted under the root
        if (!contextPath.equals("")) {
            Topic topicEntity = (Topic) model.getRegions().get("Main").getEntities().get(0);
            String topicBody = topicEntity.getTopicBody().toString();
            topicEntity.setTopicBody(new RichText(HtmlUtil.updateBasePath(topicBody, contextPath)));
        }
        return model;
    }

    /**
     * Returns page Id in given publication, which ishLogicalRef equals to given reference value.
     * @param publicationId target publication Id where to look for ishlogicalref
     * @param isLogicalReferenceValue value of meta field 'ishlogicalref.object.id'. It is supposed
     *                                that that field is common for topic which is used in different
     *                                publications
     * @return page Id of topic in given publication
     * @throws ContentProviderException
     */
    public Item getPageIdByIshLogicalReference(Integer publicationId, String isLogicalReferenceValue)
            throws ContentProviderException {
        return ishReferenceProvider.getPageIdByIshLogicalReference(publicationId, isLogicalReferenceValue);
    }
}
