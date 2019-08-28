package com.sdl.dxa.modules.ish.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.redfin.sitemapgenerator.ChangeFreq;
import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.PublicationSiteMap;
import com.sdl.dxa.modules.ish.model.SiteMapURLEntry;
import com.sdl.odata.client.api.exception.ODataClientRuntimeException;
import com.sdl.web.api.meta.WebPublicationMetaFactory;
import com.sdl.webapp.common.api.localization.Localization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;

/**
 * Sitemap service.
 */
@Service
@Profile("cil.providers.active")
@Deprecated
public class CilSitemapService implements SitemapService {
    private static final String CIL_SITEMAP_DATEFORMAT = "yyyy-MM-dd HH:mm:ss";

    @Value("${cil.sitemap.dateformat:yyyy-MM-dd HH:mm:ss}")
    private String cilSitemapDateFormat = CIL_SITEMAP_DATEFORMAT;

    @Autowired
    private WebPublicationMetaFactory webPublicationMetaFactory;

    public String createSitemap(String contextPath, Localization localization) throws IshServiceException {
        WebSitemapGenerator sitemapGenerator;
        PublicationSiteMap currentPub = null;
        try {
            sitemapGenerator = new WebSitemapGenerator(contextPath);

            String siteMapForPublication = webPublicationMetaFactory.getSiteMapForPublication(-1);

            Type publicationSiteMapType = new TypeToken<List<PublicationSiteMap>>() {}.getType();

            Gson gSon = new GsonBuilder().setDateFormat(cilSitemapDateFormat).create();
            List<PublicationSiteMap> siteMaps = gSon.fromJson(siteMapForPublication, publicationSiteMapType);
            Date currentDate = new Date();
            for (PublicationSiteMap sitemap : siteMaps) {
                currentPub = sitemap;
                for (SiteMapURLEntry item : sitemap.getUrlEntryList()) {

                    WebSitemapUrl url = new WebSitemapUrl
                            .Options(contextPath + item.getUrl())
                            .lastMod(item.getLastModifiedDate() == null
                                    ? currentDate
                                    : item.getLastModifiedDate())
                            .priority(1.0)
                            .changeFreq(ChangeFreq.HOURLY)
                            .build();
                    sitemapGenerator.addUrl(url);
                }
            }
        } catch (Exception e) {
            throw new IshServiceException("Could not generate sitemap." + (currentPub == null ? "" : currentPub.getPublicationId()), e);
        }

        return String.join("", sitemapGenerator.writeAsStrings());
    }
}
