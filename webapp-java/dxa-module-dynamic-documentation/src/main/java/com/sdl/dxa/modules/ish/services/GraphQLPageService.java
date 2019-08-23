package com.sdl.dxa.modules.ish.services;

import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;
import com.sdl.dxa.api.datamodel.model.SitemapItemModelData;
import com.sdl.dxa.common.dto.ClaimHolder;
import com.sdl.dxa.common.dto.DepthCounter;
import com.sdl.dxa.common.dto.SitemapRequestDto;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.dxa.tridion.navigation.dynamic.OnDemandNavigationModelProvider;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.odata.client.api.exception.ODataClientRuntimeException;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.Dxa22ContentProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import com.sdl.webapp.common.impl.localization.DocsLocalization;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Sitemap service.
 */
@Service
@Profile("!cil.providers.active")
public class GraphQLPageService implements PageService {
    private static final String TOC_NAV_ENTRIES_META = "tocnaventries.generated.value";
    private static final String PAGE_CONDITIONS_USED_META = "conditionsused.generated.value";
    private static final String PageLogicalRefObjectId = "ishlogicalref.object.id";

    @Autowired
    private Dxa22ContentProvider contentProvider;

    @Override
    public PageModel getPage(int pageId, Localization localization) throws ContentProviderException {
        return contentProvider.getPageModel(pageId, localization);
    }
}
