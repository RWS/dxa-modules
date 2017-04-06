package com.sdl.dxa.modules.smarttarget.mapping;

import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPageModel;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.utils.TcmUri;
import junit.framework.TestCase;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import javax.servlet.http.HttpServletRequest;

@RunWith(MockitoJUnitRunner.class)
public class AbstractSmartTargetPageBuilderTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @Spy
    @InjectMocks
    private TestSmartTargetPageBuilder pageBuilder;

    @Before
    public void init() {
        Mockito.when(webRequestContext.getLocalization()).thenReturn(localization);
        Mockito.when(localization.getId()).thenReturn("1");
    }

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

        Mockito.doReturn(null).when(pageBuilder).executeSmartTargetQuery(Matchers.any(SmartTargetPageModel.class), Matchers.any(TcmUri.class));

        //when
        pageBuilder.processQueryAndPromotions(localization, model, null);

        //then
        Mockito.verify(pageBuilder).executeSmartTargetQuery(Matchers.any(SmartTargetPageModel.class), Matchers.argThat(uriMatcher));
    }

    @Test
    public void shouldHavePositiveePriority() {
        //then
        //lower is more priority
        TestCase.assertTrue(this.pageBuilder.getOrder() >= 0);
    }

    private static class TestSmartTargetPageBuilder extends AbstractSmartTargetPageBuilder {

        public TestSmartTargetPageBuilder(HttpServletRequest httpServletRequest) {
            super(httpServletRequest);
        }
    }
}