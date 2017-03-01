package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.security.AudienceManagerSecurityProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.ViewModel;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.sdl.webapp.common.controller.ControllerUtils.INCLUDE_PATH_PREFIX;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfileControllerTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private AudienceManagerSecurityProvider securityProvider;

    @Mock
    private Localization localization;

    @InjectMocks
    @Spy
    private ProfileController controller;

    @Before
    public void init() {
        PageModel page = mock(PageModel.class);
        when(page.getUrl()).thenReturn("url");

        when(webRequestContext.getLocalization()).thenReturn(localization);
        when(webRequestContext.getPage()).thenReturn(page);

        when(localization.getPath()).thenReturn("path");
    }

    @Test
    public void shouldHaveMappingToProfile() {
        //when
        RequestMapping mapping = ProfileController.class.getAnnotation(RequestMapping.class);

        //then
        assertEquals(INCLUDE_PATH_PREFIX + "AudienceManager/Profile", mapping.value()[0]);
    }

    @Test
    public void shouldIgnoreModelIfItIsNotLoginForm() throws Exception {
        //given 
        ViewModel model = mock(ViewModel.class);

        //when
        controller.enrichModel(model, null);

        //then
        verifyZeroInteractions(model);
    }

    @Test
    public void shouldAddPageUrlIfLoginForm() throws Exception {
        //given
        LoginForm model = new LoginForm();

        //when
        LoginForm viewModel = (LoginForm) controller.enrichModel(model, new MockHttpServletRequest());

        //then
        assertEquals("url", viewModel.getLoginFormUrl());
    }

}
