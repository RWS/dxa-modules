package com.sdl.dxa.modules.ish.controller;

import com.sdl.webapp.common.controller.exception.BadRequestException;
import com.sdl.webapp.common.impl.localization.DocsLocalization;
import com.sdl.dxa.modules.ish.services.PublicationService;
import com.sdl.dxa.modules.ish.services.TridionDocsContentService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.tridion.meta.Item;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

/**
 * Test class for IshController.
 */
@ExtendWith(MockitoExtension.class)
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

    @Test
    public void getTopicIdInTargetPublicationInvalidRefArg() throws ContentProviderException {
        Assertions.assertThrows(BadRequestException.class, () -> {
            when(webRequestContext.getLocalization()).thenReturn(new DocsLocalization());
            controller.getTopicIdInTargetPublication(PUB_ID, "");
        });
    }

    @Test
    public void getTopicIdInTargetPublicationInvalidPubArg() throws ContentProviderException {
        Assertions.assertThrows(NotFoundException.class, () -> {
            when(webRequestContext.getLocalization()).thenReturn(new DocsLocalization());
            doThrow(NotFoundException.class).when(publicationService).checkPublicationOnline(eq(PUB_ID), any(Localization.class));

            controller.getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE);
        });
    }
}
