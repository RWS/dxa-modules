package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.service.SecurityProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class LogoutControllerTest {

    @Mock
    private SecurityProvider securityProvider;

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @InjectMocks
    private LogoutController controller;

    @Before
    public void init() {
        when(webRequestContext.getLocalization()).thenReturn(localization);

        when(localization.getPath()).thenReturn("path");
    }

    @Test
    public void shouldLogoutAndRedirect() {
        //when
        String path = controller.logout();

        //then
        assertEquals("redirect:path", path);
        verify(securityProvider).logout();
    }
}