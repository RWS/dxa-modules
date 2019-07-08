package com.sdl.dxa.modules.ish.providers;

import com.sdl.web.model.componentpresentation.ComponentPresentationImpl;
import com.tridion.dcp.ComponentPresentation;
import org.dd4t.providers.ComponentPresentationResultItem;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.doReturn;

/**
 * Test for IshBrokerComponentPresentationProvider class.
 */
@RunWith(MockitoJUnitRunner.class)
public class IshBrokerComponentPresentationProviderTest {
    private static final int COMPONENT_ID = 222;
    private static final int PUBLICATION_ID = 333;
    private static final int TEMPLATE_ID = 0;
    private static final int NAMESPACE = 1;

    @Spy
    @InjectMocks
    private IshBrokerComponentPresentationProvider provider = new IshBrokerComponentPresentationProvider();

    @Before
    public void setup() {
        provider.setContentIsCompressed("false");
        provider.setContentIsBase64Encoded(false);
    }


    @Test
    public void getDynamicComponentPresentationSuccess() throws Exception {
        String expected = "content text";
        ComponentPresentation presentation = new ComponentPresentationImpl(NAMESPACE, PUBLICATION_ID, COMPONENT_ID,
                TEMPLATE_ID, expected);
        doReturn(presentation).when(provider).getComponentPresentation(anyInt(), anyInt(), anyInt());

        String result = provider.getDynamicComponentPresentation(PUBLICATION_ID, COMPONENT_ID);

        assertEquals(expected, result);
    }

    @Test
    public void getDynamicComponentPresentationWithoutContent() throws Exception {
        final String emptyContent = "";
        ComponentPresentation presentation = new ComponentPresentationImpl(NAMESPACE, PUBLICATION_ID, COMPONENT_ID,
                TEMPLATE_ID, emptyContent);
        doReturn(presentation).when(provider).getComponentPresentation(anyInt(), anyInt(), anyInt());

        String result = provider.getDynamicComponentPresentation(PUBLICATION_ID, COMPONENT_ID);

        assertNull(result);
    }

    @Test
    public void getDynamicComponentPresentationItemSuccess() throws Exception {
        final String expectedContent = "some valuable content here";
        ComponentPresentation presentation = new ComponentPresentationImpl(NAMESPACE, PUBLICATION_ID, COMPONENT_ID,
                TEMPLATE_ID, expectedContent);
        doReturn(presentation).when(provider).getComponentPresentation(anyInt(), anyInt(), anyInt());

        ComponentPresentationResultItem<String> result = provider.getDynamicComponentPresentationItem(PUBLICATION_ID,
                COMPONENT_ID);

        assertEquals(PUBLICATION_ID, result.getPublicationId());
        assertEquals(TEMPLATE_ID, result.getTemplateId());
        assertEquals(COMPONENT_ID, result.getItemId());
        assertEquals(expectedContent, result.getSourceContent());
    }

    @Test
    public void getDynamicComponentPresentationItemEmptyContent() throws Exception {
        final String emptyContent = "";
        ComponentPresentation presentation = new ComponentPresentationImpl(NAMESPACE, PUBLICATION_ID, COMPONENT_ID,
                TEMPLATE_ID, emptyContent);
        doReturn(presentation).when(provider).getComponentPresentation(anyInt(), anyInt(), anyInt());

        ComponentPresentationResultItem<String> result = provider.getDynamicComponentPresentationItem(PUBLICATION_ID,
                COMPONENT_ID);

        assertEquals(PUBLICATION_ID, result.getPublicationId());
        assertEquals(TEMPLATE_ID, result.getTemplateId());
        assertEquals(COMPONENT_ID, result.getItemId());
        assertEquals(emptyContent, result.getSourceContent());
    }
}
