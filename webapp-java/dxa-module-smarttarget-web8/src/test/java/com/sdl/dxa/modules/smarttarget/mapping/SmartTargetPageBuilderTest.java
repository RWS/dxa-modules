package com.sdl.dxa.modules.smarttarget.mapping;

import com.sdl.dxa.modules.smarttarget.model.entity.AbstractSmartTargetPageModel;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPageModel;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.utils.TcmUri;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SmartTargetPageBuilderTest {

    @Spy
    private SmartTargetPageBuilder pageBuilder;

    @Test
    public void shouldExpectPageModelIdAsIntegerID() throws SmartTargetException {
        //given 
        SmartTargetPageModel model = new SmartTargetPageModel(new DefaultPageModel());
        model.setId("128");
        BaseMatcher<TcmUri> uriMatcher = new BaseMatcher<TcmUri>() {
            @Override
            public boolean matches(Object item) {
                TcmUri uri = (TcmUri) item;
                return uri.getItemId() == 128 && uri.getPublicationId() == 1;
            }

            @Override
            public void describeTo(Description description) {
                description.appendText("TCM URI is parsed successfully");
            }
        };

        doReturn(null).when(pageBuilder).executeSmartTargetQuery(any(AbstractSmartTargetPageModel.class), any(TcmUri.class));

        Localization localization = mock(Localization.class);
        when(localization.getId()).thenReturn("1");

        //when
        pageBuilder.processQueryAndPromotions(localization, model, null);

        //then
        verify(pageBuilder).executeSmartTargetQuery(any(AbstractSmartTargetPageModel.class), argThat(uriMatcher));
    }
}