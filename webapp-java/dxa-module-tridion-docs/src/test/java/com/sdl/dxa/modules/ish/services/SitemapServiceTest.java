package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.docs.localization.DocsLocalization;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.odata.client.api.exception.ODataClientRuntimeException;
import com.sdl.web.api.meta.WebPublicationMetaFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.xmlunit.matchers.EvaluateXPathMatcher;
import org.xmlunit.matchers.HasXPathMatcher;

import java.util.HashMap;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

/**
 * Tests for SitemapService.
 */
@RunWith(MockitoJUnitRunner.class)
public class SitemapServiceTest {
    private static final String CONTEXT_PATH = "http://docs.sdl.com/";
    private static final String EXPECTED_JSON = "[{\"publicationId\":2171939,\"namespaceId\":2,\"urls\":" +
            "[{\"url\":\"2171939/2229816/load-map-/load-topic\",\"lastModifiedDate\":\"2017-06-12 13:30:02\"}]}]";

    @InjectMocks
    private CilSitemapService sitemapService;

    @Mock
    private WebPublicationMetaFactory webPublicationMetaFactory;

    @Test
    public void testCreateSitemap() throws IshServiceException {
        when(webPublicationMetaFactory.getSiteMapForPublication(-1)).thenReturn(EXPECTED_JSON);
        String actualResult = sitemapService.createSitemap(CONTEXT_PATH, new DocsLocalization());
        HashMap<String, String> prefix2Uri = new HashMap<>();
        prefix2Uri.put("sitemap", "http://www.sitemaps.org/schemas/sitemap/0.9");
        assertThat(actualResult, EvaluateXPathMatcher.hasXPath("//sitemap:urlset/sitemap:url/sitemap:changefreq",
                equalTo("always")).withNamespaceContext(prefix2Uri));
        assertThat(actualResult, EvaluateXPathMatcher.hasXPath("//sitemap:urlset/sitemap:url/sitemap:loc",
                equalTo("http://docs.sdl.com/2171939/2229816/load-map-/load-topic")).withNamespaceContext(prefix2Uri));
        assertThat(actualResult, EvaluateXPathMatcher.hasXPath("//sitemap:urlset/sitemap:url/sitemap:priority",
                equalTo("1.0")).withNamespaceContext(prefix2Uri));
        assertThat(actualResult, HasXPathMatcher.hasXPath("//sitemap:urlset/sitemap:url/sitemap:lastmod")
                .withNamespaceContext(prefix2Uri));
    }

    @Test(expected = IshServiceException.class)
    public void testExceptionWhileSitemapCreation() {
        when(webPublicationMetaFactory.getSiteMapForPublication(-1)).thenThrow(ODataClientRuntimeException.class);
        sitemapService.createSitemap(CONTEXT_PATH, new DocsLocalization());
    }
}
