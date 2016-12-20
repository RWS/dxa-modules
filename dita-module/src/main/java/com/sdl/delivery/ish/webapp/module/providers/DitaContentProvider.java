package com.sdl.delivery.ish.webapp.module.providers;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.util.LocalizationUtils;
import com.sdl.webapp.common.util.TcmUtils;
import com.sdl.webapp.tridion.mapping.DefaultContentProvider;
import com.sdl.webapp.tridion.mapping.ModelBuilderPipeline;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.core.exceptions.FactoryException;
import org.dd4t.core.exceptions.ItemNotFoundException;
import org.dd4t.core.factories.PageFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

import java.io.UnsupportedEncodingException;

import static com.sdl.webapp.common.util.LocalizationUtils.findPageByPath;

/**
 * Dita content provider
 */
@Component
@Slf4j
@Primary
public class DitaContentProvider extends DefaultContentProvider {

    private static final Object LOCK = new Object();

    @Autowired
    private PageFactory dd4tPageFactory;

    @Autowired
    private ModelBuilderPipeline modelBuilderPipeline;

    @Autowired
    private WebRequestContext webRequestContext;

    /**
     * Get a page model by path.
     * This provider does not use the path. Instead it uses the ids to retrieve the page model.
     * The id's are parsed from the path.
     *
     * @param path Path
     * @param localization Localization
     * @return
     * @throws ContentProviderException
     */
    @Override
    @SneakyThrows(UnsupportedEncodingException.class)
    public PageModel getPageModel(String path, final Localization localization) throws ContentProviderException {
        path = UriUtils.encodePath(path, "UTF-8");
        return findPageByPath(path, localization, new LocalizationUtils.TryFindPage<PageModel>() {
            public PageModel tryFindPage(String path, int publicationId) throws ContentProviderException {
                final org.dd4t.contentmodel.Page genericPage;
                try {
                    synchronized (LOCK) {
                        String uri = TcmUtils.buildTcmUri(publicationId, 164155, 16);
                        String source = dd4tPageFactory.findSourcePageByTcmId(uri);
                        genericPage = dd4tPageFactory.deserialize(source, PageImpl.class);
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
}
