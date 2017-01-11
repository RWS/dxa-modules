package com.sdl.delivery.ish.webapp.module.providers;

import com.google.common.io.Files;
import com.sdl.web.api.content.BinaryContentRetriever;
import com.sdl.web.api.meta.WebComponentMetaFactory;
import com.sdl.web.api.meta.WebComponentMetaFactoryImpl;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.util.LocalizationUtils;
import com.sdl.webapp.common.util.TcmUtils;
import com.sdl.webapp.tridion.mapping.DefaultContentProvider;
import com.sdl.webapp.tridion.mapping.ModelBuilderPipeline;
import com.tridion.data.BinaryData;
import com.tridion.meta.ComponentMeta;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.dd4t.contentmodel.impl.PageImpl;
import org.dd4t.core.exceptions.FactoryException;
import org.dd4t.core.exceptions.ItemNotFoundException;
import org.dd4t.core.factories.PageFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.io.File;
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

    private static final String STATIC_FILES_DIR = "BinaryData";

    @Autowired
    private PageFactory dd4tPageFactory;

    @Autowired
    private BinaryContentRetriever binaryContentRetriever;

    @Autowired
    private ModelBuilderPipeline modelBuilderPipeline;

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private WebApplicationContext webApplicationContext;

    /**
     * Get a page model by it's item id.
     *
     * @param pageId       The page id
     * @param localization Localization
     * @return
     * @throws ContentProviderException
     */
    @Override
    public PageModel getPageModel(final String pageId, final Localization localization)
            throws ContentProviderException {
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

                PageModel pageModel = modelBuilderPipeline.createPageModel(genericPage, localization,
                        DitaContentProvider.this);
                if (pageModel != null) {
                    pageModel.setUrl(LocalizationUtils.stripDefaultExtension(path));
                    webRequestContext.setPage(pageModel);
                }
                return pageModel;
            }
        });
    }

    public byte[] getBinaryContent(final Integer pageId, final Integer binaryId) throws ContentProviderException {
        WebComponentMetaFactory factory = new WebComponentMetaFactoryImpl(pageId);
        ComponentMeta componentMeta = factory.getMeta(binaryId);
        if (componentMeta == null) {
            throw new BinaryNotFoundException("No meta meta found for: [" + pageId + "-" + binaryId + "]");
        }

        String parentDir = StringUtils.join(new String[]{
                webApplicationContext.getServletContext().getRealPath("/"), STATIC_FILES_DIR, pageId.toString()
        }, File.separator);

        File file = new File(parentDir, binaryId.toString());

        long componentTime = componentMeta.getLastPublicationDate().getTime();
        byte[] data;
        if (isToBeRefreshed(file, componentTime)) {
            data = getBinaryFromContentService(pageId, binaryId);
            try {
                Files.write(data, file);
            } catch (IOException e) {
                log.error("Unable to write local file: " + file.getAbsolutePath(), e);
            }
        } else {
            try {
                data = Files.toByteArray(file);
            } catch (IOException e) {
                throw new ContentProviderException("Ubable to read locally stored file: " + file.getAbsolutePath(), e);
            }
        }
        return data;
    }

    private byte[] getBinaryFromContentService(Integer pageId, Integer binaryId) throws ContentProviderException {
        BinaryData data = binaryContentRetriever.getBinary(pageId, binaryId);
        if (data == null) {
            throw new BinaryNotFoundException("Unable to retrieve binary from content service");
        }
        try {
            return data.getBytes();
        } catch (IOException e) {
            throw new ContentProviderException("Unable to extract data from BinaryData object", e);
        }
    }
}
