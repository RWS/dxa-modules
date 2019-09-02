package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.enums.ContentIncludeMode;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Page;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.Dxa22ContentProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.ViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Sitemap service.
 */
@Service
@Profile("!cil.providers.active")
public class GraphQLPageService implements PageService {
    private static final String TOC_NAV_ENTRIES_META = "tocnaventries.generated.value";
    private static final String PAGE_CONDITIONS_USED_META = "conditionsused.generated.value";
    private static final String PAGE_LOGICAL_REF_OBJECT_ID = "ishlogicalref.object.id";

    @Autowired
    private ApiClientProvider clientProvider;

    @Autowired
    private Dxa22ContentProvider contentProvider;

    @Override
    public ViewModel getPage(int pageId, Localization localization) throws ContentProviderException {
        PageModel model = contentProvider.getPageModel(pageId, localization);

        return enrichPage(model, localization);
    }

    private ViewModel enrichPage(ViewModel pageModel, Localization localization) {
        ApiClient client = clientProvider.getClient();
        PageModel model = (PageModel) pageModel;

        String metaFilter = String.format(
                "requiredMeta:%s,%s,%s",
                TOC_NAV_ENTRIES_META,
                PAGE_CONDITIONS_USED_META,
                PAGE_LOGICAL_REF_OBJECT_ID
        );
        Page page = client.getPage(
                ContentNamespace.Docs,
                Integer.parseInt(localization.getId()),
                model.getId(), metaFilter,
                ContentIncludeMode.EXCLUDE,
                null);
        if(page.getCustomMetas() != null) {

            for (CustomMetaEdge metaEdge : page.getCustomMetas().getEdges()) {
                if (TOC_NAV_ENTRIES_META.equals(metaEdge.getNode().getKey())) {
                    if (model.getMeta().containsKey(TOC_NAV_ENTRIES_META)) {
                        String v = String.format("%s, %s", model.getMeta().get(TOC_NAV_ENTRIES_META), metaEdge.getNode().getValue());
                        model.getMeta().put(metaEdge.getNode().getKey(), v);
                    } else {
                        model.getMeta().put(TOC_NAV_ENTRIES_META, metaEdge.getNode().getValue());
                    }
                }

                if (PAGE_CONDITIONS_USED_META.equals(metaEdge.getNode().getKey())) {
                    model.getMeta().put(PAGE_CONDITIONS_USED_META, metaEdge.getNode().getValue());
                }

                if (PAGE_LOGICAL_REF_OBJECT_ID.equals(metaEdge.getNode().getKey()) && !model.getMeta().containsKey(PAGE_LOGICAL_REF_OBJECT_ID)) {
                    model.getMeta().put(PAGE_LOGICAL_REF_OBJECT_ID, metaEdge.getNode().getValue());
                }
            }

        }
        return model;
    }
}
