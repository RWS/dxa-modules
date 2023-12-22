package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.providers.IshReferenceProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

/**
 * Test class for ContentService.
 */
@ExtendWith(MockitoExtension.class)
public class TridionDocsContentServiceTest {
    private static final Integer PUB_ID = 10992;
    private static final String LOGICAL_REF_VALUE = "ishlogicalref.object.id.value";

    @Mock
    private IshReferenceProvider provider;
    @Spy
    @InjectMocks
    private TridionDocsContentService contentService;

    @Test
    public void getPageIdByIshLogicalReference() throws ContentProviderException {
        contentService.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);

        verify(contentService).getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
        verify(provider).getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
        verifyNoMoreInteractions(contentService, provider);
    }
}
