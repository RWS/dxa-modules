package com.sdl.dxa.modules.ish.providers;

import com.google.common.io.Files;
import com.google.common.primitives.Ints;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.common.util.PathUtils;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.tridion.content.StaticContentResolver;
import com.sdl.dxa.tridion.mapping.ModelBuilderPipeline;
import com.sdl.dxa.tridion.mapping.impl.DefaultContentProvider;
import com.sdl.dxa.tridion.modelservice.DefaultModelService;
import com.sdl.dxa.tridion.modelservice.ModelServiceClient;
import com.sdl.dxa.tridion.modelservice.ModelServiceConfiguration;
import com.sdl.dxa.tridion.modelservice.exceptions.ItemNotFoundInModelServiceException;
import com.sdl.dxa.tridion.modelservice.exceptions.ModelServiceInternalServerErrorException;
import com.sdl.web.api.content.BinaryContentRetriever;
import com.sdl.web.api.meta.WebBinaryMetaFactory;
import com.sdl.web.api.meta.WebComponentMetaFactory;
import com.sdl.web.api.meta.WebComponentMetaFactoryImpl;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.LinkResolver;
import com.sdl.webapp.common.api.content.StaticContentItem;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.sdl.webapp.common.util.MimeUtils;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.ItemTypes;
import com.tridion.data.BinaryData;
import com.tridion.meta.BinaryMeta;
import com.tridion.meta.ComponentMeta;
import com.tridion.meta.NameValuePair;
import com.tridion.meta.PageMeta;
import com.tridion.meta.PageMetaFactory;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import static com.sdl.webapp.common.util.FileUtils.isToBeRefreshed;

/**
 * Ish content provider.
 */
@Component("ishContentProvider")
@Slf4j
public class IshContentProvider extends DefaultContentProvider {

    private static final String STATIC_FILES_DIR = "BinaryData";
    private static final String TOC_NAVENTRIES_META = "tocnaventries.generated.value";
    private static final String PAGE_CONDITIONS_USED_META = "conditionsused.generated.value";
    private static final String PAGE_LOGICAL_REF_OBJECT_ID = "ishlogicalref.object.id";

    @Autowired
    @Qualifier("ishModuleServiceClient")
    private ModelServiceClient modelServiceClient;

    @Autowired
    private ModelServiceConfiguration modelServiceConfiguration;

    @Autowired
    private BinaryContentRetriever binaryContentRetriever;

    @Autowired
    private ModelBuilderPipeline modelBuilderPipeline;

    @Autowired
    private WebRequestContext webRequestContext;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private WebBinaryMetaFactory webBinaryMetaFactory;

    @Autowired
    public IshContentProvider(WebRequestContext webRequestContext,
                              StaticContentResolver staticContentResolver,
                              LinkResolver linkResolver,
                              ModelBuilderPipeline builderPipeline,
                              DefaultModelService modelService) {
        super(webRequestContext, staticContentResolver, linkResolver, builderPipeline, modelService);
    }

    /**
     * Get a page model by it's item id.
     *
     * @param pageId       The page id
     * @param localization Localization
     * @return page model
     */
    @Override
    public PageModel getPageModel(final String pageId, final Localization localization) {
        int publicationId = Ints.tryParse(localization.getId());
        String cmId = TcmUtils.buildTcmUri("ish", String.valueOf(publicationId), pageId, ItemTypes.COMPONENT);
        try {
            String serviceUrl = modelServiceConfiguration.getPageModelUrl(); //we need to convert URL to form like http://<CM.client.ip>:<port>/PageModel/ish/pubId-pageId
            serviceUrl = serviceUrl.replaceAll("(.*)/(\\{localizationId\\})/(\\{pageUrl\\})\\?.*", "$1/$2-$3");
            PageModelData pageModelData = modelServiceClient.getForType(serviceUrl, PageModelData.class, "ish", String.valueOf(publicationId), pageId, "INCLUDE");
            PageModel pageModel = modelBuilderPipeline.createPageModel(pageModelData);
            pageModel.setUrl(PathUtils.stripDefaultExtension(pageId));

            // Enhance the page model with custom metadata
            processPageMetaIfAny(publicationId, cmId, pageModel);
            webRequestContext.setPage(pageModel);
            return pageModel;
        } catch (ItemNotFoundInModelServiceException | ModelServiceInternalServerErrorException e) {
            log.warn("Page not found: [{}] for id {}", publicationId, pageId, e);
            return null;
        }
    }

    private void processPageMetaIfAny(int publicationId, String cmId, PageModel pageModel) {
        PageMetaFactory pageMetaFactory = new PageMetaFactory(publicationId);
        PageMeta pageMeta = pageMetaFactory.getMeta(cmId);
        if (pageMeta == null) {
            return;
        }
        // Put the information about the toc entries on the metadata
        // This is required by the UI so it knows the location of the page in the Toc
        NameValuePair tocNavEntries = pageMeta.getCustomMeta().getNameValues().get(TOC_NAVENTRIES_META);
        if (tocNavEntries != null) {
            List<String> values = (List<String>) (Object) tocNavEntries.getMultipleValues();
            if (values != null) {
                pageModel.getMeta().put(TOC_NAVENTRIES_META, String.join(", ", values));
            }
        }
        // Put the information about used conditions form page metadata
        if (pageMeta.getCustomMeta().getFirstValue(PAGE_CONDITIONS_USED_META) != null) {
            String value = String.valueOf(pageMeta.getCustomMeta().getFirstValue(PAGE_CONDITIONS_USED_META));
            pageModel.getMeta().put(PAGE_CONDITIONS_USED_META, value);
        }

        // Add logical Ref ID information
        if (pageMeta.getCustomMeta().getFirstValue(PAGE_LOGICAL_REF_OBJECT_ID) != null) {
            String value = String.valueOf(pageMeta.getCustomMeta().getFirstValue(PAGE_LOGICAL_REF_OBJECT_ID));
            pageModel.getMeta().put(PAGE_LOGICAL_REF_OBJECT_ID, value);
        }
    }

    /**
     * Gets content of binary element (image, document, etc.).
     *
     * @param publicationId Publication id
     * @param binaryId      Binary element id
     * @return StaticContentItem with binary content
     */
    public StaticContentItem getBinaryContent(final Integer publicationId, final Integer binaryId) {
        WebComponentMetaFactory factory = new WebComponentMetaFactoryImpl(publicationId);
        ComponentMeta componentMeta = factory.getMeta(binaryId);
        if (componentMeta == null) {
            throw new NotFoundException("No metadata found for: [" + publicationId + "-" + binaryId + "]");
        }

        String binaryUri = TcmUtils.buildTcmUri("ish", publicationId, binaryId, ItemTypes.COMPONENT);
        BinaryMeta binaryMeta = webBinaryMetaFactory.getMeta(binaryUri);
        if (binaryMeta == null) {
            throw new NotFoundException("Unable to get binary metadata for: [" + publicationId + "-"
                    + binaryId + "]");
        }

        String parentDir = StringUtils.join(new String[]{
                webApplicationContext.getServletContext().getRealPath("/"), STATIC_FILES_DIR, publicationId.toString()
        }, File.separator);

        File file = new File(parentDir, binaryId.toString() + binaryMeta.getType());

        long componentTime = componentMeta.getLastPublicationDate().getTime();
        byte[] data;

        boolean isToBeRefreshed;
        try {
            isToBeRefreshed = isToBeRefreshed(file, componentTime);
        } catch (ContentProviderException e) {
            throw new IshServiceException(e);
        }

        if (isToBeRefreshed) {
            data = getBinaryFromContentService(publicationId, binaryId);
            try {
                Files.write(data, file);
            } catch (IOException e) {
                log.error("Unable to write local file: " + file.getAbsolutePath(), e);
            }
        } else {
            try {
                data = Files.toByteArray(file);
            } catch (IOException e) {
                throw new NotFoundException("Unable to read locally stored file: " + file.getAbsolutePath(), e);
            }
        }

        return createStaticContentItem(data, binaryMeta);
    }

    private byte[] getBinaryFromContentService(Integer publicationId, Integer binaryId) {
        BinaryData data = binaryContentRetriever.getBinary(publicationId, binaryId);
        if (data == null) {
            throw new NotFoundException("Unable to retrieve binary " + "[" + publicationId + "-" + binaryId + "]"
                    + " from content service");
        }
        try {
            return data.getBytes();
        } catch (IOException e) {
            throw new IshServiceException("Unable to extract data from BinaryData object" + "["
                    + publicationId + "-" + binaryId + "]", e);
        }
    }

    private StaticContentItem createStaticContentItem(final byte[] binaryData, final BinaryMeta binaryMeta) {
        return new StaticContentItem() {
            public long getLastModified() {
                return 0;
            }

            public String getContentType() {
                return MimeUtils.getMimeType(binaryMeta.getType());
            }

            public InputStream getContent() throws IOException {
                return new ByteArrayInputStream(binaryData);
            }

            public boolean isVersioned() {
                return false;
            }
        };
    }
}
