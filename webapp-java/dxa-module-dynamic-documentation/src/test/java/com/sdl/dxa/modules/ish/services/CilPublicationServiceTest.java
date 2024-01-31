package com.sdl.dxa.modules.ish.services;

import com.sdl.webapp.common.impl.localization.DocsLocalization;;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.web.api.meta.WebPublicationMetaFactory;
import com.tridion.broker.StorageException;
import com.tridion.meta.PublicationMeta;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * PublicationService test.
 */
@ExtendWith(MockitoExtension.class)
public class CilPublicationServiceTest {

    @Mock
    private WebPublicationMetaFactory webPublicationMetaFactory;

    @InjectMocks
    private CilPublicationService cilPublicationService;

    @SuppressWarnings("magicnumber")
    @Test
    public void testGetPublicationListSuccess() throws Exception {
        PublicationMeta meta = mock(PublicationMeta.class, RETURNS_DEEP_STUBS);
        lenient().when(meta.getId()).thenReturn(123);
        lenient().when(meta.getCustomMeta().getFirstValue("publicationtitle.generated.value")).thenReturn("pub_title");
        lenient().when(meta.getCustomMeta().getNameValues().get("FISHPRODUCTFAMILYNAME.logical.value").getMultipleValues())
                .thenReturn(Arrays.asList("prod_family_1", "prod_family_2"));
        lenient().when(meta.getCustomMeta().getNameValues().get("FISHPRODUCTRELEASENAME.version.value").getMultipleValues())
                .thenReturn(Arrays.asList("pub_prod_version_1", "pub_prod_version_2"));
        lenient().when(meta.getCustomMeta().getFirstValue("ishversionref.object.id")).thenReturn(Float.valueOf("1111.0"));
        lenient().when(meta.getCustomMeta().getFirstValue("FISHPUBLNGCOMBINATION.lng.value")).thenReturn("en");
        lenient().when(meta.getCustomMeta().getFirstValue("FISHDITADLVRREMOTESTATUS.lng.element"))
            .thenReturn("VDITADLVRREMOTESTATUSONLINE");

        lenient().when(meta.getCustomMeta().getFirstValue("CREATED-ON.version.value")).thenReturn("pub_cratedOn_date");
        lenient().when(meta.getCustomMeta().getFirstValue("VERSION.version.value")).thenReturn("pub_version");
        lenient().when(meta.getCustomMeta().getFirstValue("ishref.object.value")).thenReturn("logical_id");
        PublicationMeta[] metas = {meta};

        lenient().when(webPublicationMetaFactory.getAllMeta(Arrays.asList(
            "publicationtitle.generated.value", "FISHPRODUCTFAMILYNAME.logical.value",
            "FISHPRODUCTRELEASENAME.version.value", "ishversionref.object.id",
            "FISHPUBLNGCOMBINATION.lng.value", "FISHDITADLVRREMOTESTATUS.lng.element",
            "CREATED-ON.version.value", "VERSION.version.value", "ishref.object.value"
        ))).thenReturn(metas);

        List<Publication> result = cilPublicationService.getPublicationList(new DocsLocalization());

        assertEquals(1, result.size());
        assertEquals("123", result.get(0).getId());
        assertEquals("pub_title", result.get(0).getTitle());
        // assertEquals(Arrays.asList("prod_family_1", "prod_family_2"), result.get(0).getProductFamily());
        // assertEquals(Arrays.asList("pub_prod_version_1", "pub_prod_version_2"), result.get(0).getProductReleaseVersion());
        assertEquals("1111", result.get(0).getVersionRef());
        assertEquals("en", result.get(0).getLanguage());
        assertEquals("pub_cratedOn_date", result.get(0).getCreatedOn());
        assertEquals("pub_version", result.get(0).getVersion());
        assertEquals("logical_id", result.get(0).getLogicalId());
    }

    @Test
    public void testGetPublicationListFailure() throws Exception {
        Assertions.assertThrows(IshServiceException.class, () -> {
            doThrow(StorageException.class)
                    .when(webPublicationMetaFactory)
                    .getAllMeta(Arrays.asList(
                            "publicationtitle.generated.value", "FISHPRODUCTFAMILYNAME.logical.value",
                            "FISHPRODUCTRELEASENAME.version.value", "ishversionref.object.id",
                            "FISHPUBLNGCOMBINATION.lng.value", "FISHDITADLVRREMOTESTATUS.lng.element",
                            "CREATED-ON.version.value", "VERSION.version.value", "ishref.object.value"
                    ));

            cilPublicationService.getPublicationList(new DocsLocalization());
        });
    }

    @Test
    public void testIsPublicationOnlineTrue() {
        PublicationMeta pubMeta = mock(PublicationMeta.class, RETURNS_DEEP_STUBS);
        when(pubMeta.getCustomMeta().getFirstValue("FISHDITADLVRREMOTESTATUS.lng.element"))
                .thenReturn("VDITADLVRREMOTESTATUSONLINE");

        assertTrue(cilPublicationService.isPublicationOnline(pubMeta));
    }

    @Test
    public void testIsPublicationOnlineFalse() {
        PublicationMeta pubMeta = mock(PublicationMeta.class, RETURNS_DEEP_STUBS);
        when(pubMeta.getCustomMeta().getFirstValue("FISHDITADLVRREMOTESTATUS.lng.element"))
                .thenReturn("some value");

        assertFalse(cilPublicationService.isPublicationOnline(pubMeta));
    }

}
