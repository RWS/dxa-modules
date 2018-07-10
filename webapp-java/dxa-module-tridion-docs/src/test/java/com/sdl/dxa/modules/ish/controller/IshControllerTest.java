package com.sdl.dxa.modules.ish.controller;

import com.sdl.dxa.modules.ish.providers.PublicationService;
import com.sdl.dxa.modules.ish.providers.TridionDocsContentService;
import com.sdl.webapp.common.api.content.ContentProviderException;
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
    @Spy
    @InjectMocks
    private IshController controller;

    @Test
    public void getTopicIdInTargetPublication() throws ContentProviderException {
        when(contentService.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE)).thenReturn(pageId);

        assertEquals(pageId, controller.getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE));

        InOrder inOrder = Mockito.inOrder(controller, publicationService, contentService);
        inOrder.verify(controller).getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE);
        inOrder.verify(publicationService).checkPublicationOnline(PUB_ID);
        inOrder.verify(contentService).getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
        verifyNoMoreInteractions(controller, publicationService, contentService);
    }

    @Test(expected = NotFoundException.class)
    public void getTopicIdInTargetPublicationInvalidRefArg() throws ContentProviderException {
        controller.getTopicIdInTargetPublication(PUB_ID, "");
    }

    @Test(expected = NotFoundException.class)
    public void getTopicIdInTargetPublicationInvalidPubArg() throws ContentProviderException {
        doThrow(NotFoundException.class).when(publicationService).checkPublicationOnline(PUB_ID);

        controller.getTopicIdInTargetPublication(PUB_ID, LOGICAL_REF_VALUE);
    }
}
