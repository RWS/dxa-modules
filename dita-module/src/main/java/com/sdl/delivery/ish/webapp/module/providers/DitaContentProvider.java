package com.sdl.delivery.ish.webapp.module.providers;

import com.sdl.web.api.content.BinaryContentRetriever;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.util.LocalizationUtils;
import com.sdl.webapp.common.util.TcmUtils;
import com.sdl.webapp.tridion.mapping.DefaultContentProvider;
import com.sdl.webapp.tridion.mapping.ModelBuilderPipeline;
import com.tridion.data.BinaryData;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.core.exceptions.FactoryException;
import org.dd4t.core.exceptions.ItemNotFoundException;
import org.dd4t.core.factories.PageFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static com.sdl.webapp.common.util.LocalizationUtils.findPageByPath;
import static org.dd4t.core.util.TCMURI.Namespace;

/**
 * Dita content provider.
 */
@Component
@Slf4j
@Primary
public class DitaContentProvider extends DefaultContentProvider {

    @Autowired
    private PageFactory dd4tPageFactory;

    @Autowired
    private BinaryContentRetriever binaryContentRetriever;

    @Autowired
    private ModelBuilderPipeline modelBuilderPipeline;

    @Autowired
    private WebRequestContext webRequestContext;

    /**
     * Get a page model by it's item id.
     *
     * @param pageId       The page id
     * @param localization Localization
     * @return
     * @throws ContentProviderException
     */
    @Override
    public PageModel getPageModel(final String pageId, final Localization localization) throws ContentProviderException {
        return findPageByPath(pageId, localization, new LocalizationUtils.TryFindPage<PageModel>() {
            public PageModel tryFindPage(String path, int publicationId) throws ContentProviderException {
                final org.dd4t.contentmodel.Page genericPage;
                try {
                    Namespace namespace = Namespace.valueOf(localization.getCmUriScheme().toUpperCase());
                    String cmId = TcmUtils.buildCmUri(namespace, Integer.toString(publicationId), pageId, "16");
                    String source = dd4tPageFactory.findSourcePageByTcmId(cmId);
                    if (source != null) {
                        genericPage = dd4tPageFactory.deserialize(source, PageImpl.class);
                    } else {
                        return null;
                    }
                } catch (ItemNotFoundException e) {
                    log.debug("Page not found: [{}] {}", publicationId, path, e);
                    return null;
                } catch (FactoryException e) {
                    throw new ContentProviderException("Exception while getting page model for: [" + publicationId +
                            "] " + path, e);
                }

                PageModel pageModel = modelBuilderPipeline.createPageModel(genericPage, localization, DitaContentProvider.this);
                if (pageModel != null) {
                    pageModel.setUrl(LocalizationUtils.stripDefaultExtension(path));
                    webRequestContext.setPage(pageModel);
                }
                return pageModel;
            }
        });
    }

    public byte[] getBinaryContent(final Integer pageId, final Integer binaryId) throws IOException {
        BinaryData data = binaryContentRetriever.getBinary(pageId, binaryId);
        return data.getBytes();
    }
}
