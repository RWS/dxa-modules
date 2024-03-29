package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.providers.IshDynamicNavigationProvider;
import com.sdl.webapp.common.impl.localization.DocsLocalization;;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.navigation.NavigationFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * TocService test.
 */
@ExtendWith(MockitoExtension.class)
public class TocServiceTest {

    private Set<SitemapItem> tocItems;

    @Mock
    private IshDynamicNavigationProvider ishNavigationProvider;

    @InjectMocks
    private TocService tocService;

    @BeforeEach
    public void setup() {
        tocItems = new HashSet<>();
        SitemapItem item1 = new SitemapItem();
        item1.setId("t1-k2");
        SitemapItem item2 = new SitemapItem();
        item2.setId("t1-k10");
        Collections.addAll(tocItems, item1, item2);
    }

    @Test
    public void testGetToc() throws ContentProviderException {
        final Integer publicationId = 1123123;
        final String sitemapId = "3333";
        final HttpServletRequest request = mock(HttpServletRequest.class);
        final WebRequestContext webRequestContext = mock(WebRequestContext.class);

        when(ishNavigationProvider.getNavigationSubtree(anyString(), any(NavigationFilter.class),
                any(Localization.class))).thenReturn(tocItems);

        when(webRequestContext.getLocalization()).thenReturn(new DocsLocalization());

        Collection<SitemapItem> result = tocService.getToc(publicationId, sitemapId, false, 1, "",
                webRequestContext);
        assertEquals(2, result.size());
    }
}
