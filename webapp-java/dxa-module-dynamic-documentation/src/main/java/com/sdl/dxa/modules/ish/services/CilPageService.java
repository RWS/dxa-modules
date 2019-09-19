package com.sdl.dxa.modules.ish.services;

import com.sdl.web.api.meta.WebPageMetaFactory;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.Dxa22ContentProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.tridion.meta.CustomMeta;
import com.tridion.meta.PageMeta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Sitemap service.
 */
@Service
@Profile("cil.providers.active")
public class CilPageService implements PageService {
    private static final String TOC_NAV_ENTRIES_META = "tocnaventries.generated.value";
    private static final String PAGE_CONDITIONS_USED_META = "conditionsused.generated.value";
    private static final String PAGE_LOGICAL_REF_OBJECT_ID = "ishlogicalref.object.id";

    private WebPageMetaFactory metaFactory;

    @Autowired
    private Dxa22ContentProvider contentProvider;

    @Override
    @Cacheable(value = "ish",
            key = "{ #localization.id, #pageId }",
            condition = "#localization != null && #localization.id != null",
            sync = true)
    public ViewModel getPage(int pageId, Localization localization) throws ContentProviderException {
        PageModel model = contentProvider.getPageModel(pageId, localization);
        return enrichPage(model, localization);
    }

    private ViewModel enrichPage(ViewModel pageModel, Localization localization) {
        PageModel model = (PageModel) pageModel;
        PageMeta meta = this.metaFactory.getMeta(model.getId());

        String metaFilter = String.format("requiredMeta:%s,%s,%s",
                TOC_NAV_ENTRIES_META,
                PAGE_CONDITIONS_USED_META,
                PAGE_LOGICAL_REF_OBJECT_ID);

        CustomMeta rootCustomMeta = meta.getCustomMeta();
        if (rootCustomMeta == null) {
            return model;
        }
        CustomMeta tocNavEntriesMeta = rootCustomMeta.getChild(TOC_NAV_ENTRIES_META);
        if (tocNavEntriesMeta != null) {
            String v = String.format("%s, %s", model.getMeta().get(TOC_NAV_ENTRIES_META), tocNavEntriesMeta.getFirstValue(tocNavEntriesMeta.getName()));
            model.getMeta().put(tocNavEntriesMeta.getName(), v);
        } else {
            model.getMeta().put(TOC_NAV_ENTRIES_META, (String) tocNavEntriesMeta.getFirstValue(tocNavEntriesMeta.getName()));
        }

        CustomMeta pageConditionsUsedMeta = rootCustomMeta.getChild(PAGE_CONDITIONS_USED_META);
        if (pageConditionsUsedMeta != null) {
            model.getMeta().put(PAGE_CONDITIONS_USED_META, (String) tocNavEntriesMeta.getFirstValue(pageConditionsUsedMeta.getName()));
        }

        CustomMeta pageLogicalRefObjectIdMeta = rootCustomMeta.getChild(PAGE_LOGICAL_REF_OBJECT_ID);
        if (pageLogicalRefObjectIdMeta != null) {
            model.getMeta().put(PAGE_LOGICAL_REF_OBJECT_ID, (String) tocNavEntriesMeta.getFirstValue(pageLogicalRefObjectIdMeta.getName()));
        }

        return model;
    }
}