package com.sdl.dxa.modules.ish.controller;

import com.sdl.webapp.common.impl.localization.DocsLocalization;;
import com.sdl.dxa.modules.ish.services.PublicationService;
import com.sdl.dxa.modules.ish.services.TridionDocsContentService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.tridion.meta.Item;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

/**
 * Test class for IshController.
 */
@RunWith(MockitoJUnitRunner.class)
public class IshControllerTest {
    private static final Integer PUB_ID = 10992;
    private static final String LOGICAL_REF_VALUE = "ishlogicalref.object.id.value";
    @Mock
    private Item pageId;
    @Mock
    private PublicationService publicationService;
    @Mock
    private TridionDocsContentService contentService;
    @Mock
    private WebRequestContext webRequestContext;

    @Spy
    @InjectMocks
    private IshController controller;

    @Test
    public void getTopicIdInTargetPublication() throws ContentProviderException {
        when(webRequestContext.getLocalization()).thenReturn(new DocsLocalization());
        when(contentService.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE)).thenReturn(pageId);

        assertEquals(pageId, controller.getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE));

        InOrder inOrder = Mockito.inOrder(controller, publicationService, contentService);
        inOrder.verify(controller).getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE);
        inOrder.verify(publicationService).checkPublicationOnline(eq(PUB_ID), any(Localization.class));
        inOrder.verify(contentService).getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
        verifyNoMoreInteractions(controller, publicationService, contentService);
    }

    @Test(expected = NotFoundException.class)
    public void getTopicIdInTargetPublicationInvalidRefArg() throws ContentProviderException {
        when(webRequestContext.getLocalization()).thenReturn(new DocsLocalization());
        controller.getTopicIdInTargetPublication(PUB_ID, "");
    }

    @Test(expected = NotFoundException.class)
    public void getTopicIdInTargetPublicationInvalidPubArg() throws ContentProviderException {
        when(webRequestContext.getLocalization()).thenReturn(new DocsLocalization());
        doThrow(NotFoundException.class).when(publicationService).checkPublicationOnline(eq(PUB_ID), any(Localization.class));

        controller.getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE);
    }
}
