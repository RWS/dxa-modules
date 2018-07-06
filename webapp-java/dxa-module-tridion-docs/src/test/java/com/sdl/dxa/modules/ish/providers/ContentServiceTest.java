package com.sdl.dxa.modules.ish.providers;

import com.sdl.webapp.common.api.content.ContentProviderException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

/**
 * Test class for ContentService.
 */
@RunWith(MockitoJUnitRunner.class)
public class ContentServiceTest {
    private static final Integer PUB_ID = 10992;
    private static final String LOGICAL_REF_VALUE = "ishlogicalref.object.id.value";

    @Mock
    private IshReferenceProvider provider;
    @Spy
    @InjectMocks
    private ContentService contentService;

    @Test
    public void getPageIdByIshLogicalReference() throws ContentProviderException {
        contentService.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);

        verify(contentService).getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
        verify(provider).getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
        verifyNoMoreInteractions(contentService, provider);
    }
}
