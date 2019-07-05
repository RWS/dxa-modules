package com.sdl.dxa.modules.ish.providers;

import com.sdl.web.api.meta.WebPublicationMetaFactory;
import com.sdl.web.model.PublicationMetaImpl;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

/**
 * Test for ConditionService class.
 */
@RunWith(MockitoJUnitRunner.class)
public class ConditionServiceTest {
    private static final Integer PUBLICATION_ID = 12345;
    private static final String CONDITION_USED = "{\"MODEL\":[\"330\"],\"GPRS\":[\"Y\"],\"LOUDSPEAKER\":[\"Y\"]}";
    private static final String CONDITION_DATATYPE = "{\"MODEL\":{\"datatype\":\"Text\",\"range\":false}," +
            "\"GPRS\":{\"datatype\":\"Text\",\"range\":false}," +
            "\"LOUDSPEAKER\":{\"datatype\":\"Text\",\"range\":false}}";

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private WebPublicationMetaFactory webPublicationMetaFactory;

    @InjectMocks
    private CilConditionService conditionService = new CilConditionService();

    @Test
    public void testGetConditionsSuccess() throws Exception {
        final String expectedJson = "{\"MODEL\":{\"values\":[\"330\"],\"datatype\":\"Text\",\"range\":false}," +
                "\"GPRS\":{\"values\":[\"Y\"],\"datatype\":\"Text\",\"range\":false}," +
                "\"LOUDSPEAKER\":{\"values\":[\"Y\"],\"datatype\":\"Text\",\"range\":false}}";
        when(webPublicationMetaFactory.getMeta(PUBLICATION_ID).getCustomMeta()
                .getFirstValue("conditionsused.generated.value")).thenReturn(CONDITION_USED);
        when(webPublicationMetaFactory.getMeta(PUBLICATION_ID).getCustomMeta()
                .getFirstValue("conditionmetadata.generated.value")).thenReturn(CONDITION_DATATYPE);

        assertEquals(expectedJson, conditionService.getConditions(PUBLICATION_ID, any(Localization.class)));
    }

    @Test(expected = NotFoundException.class)
    public void testGetConditionsMetaNotFound() throws Exception {
        when(webPublicationMetaFactory.getMeta(PUBLICATION_ID)).thenReturn(new PublicationMetaImpl());

        conditionService.getConditions(PUBLICATION_ID, any(Localization.class));
    }
}
