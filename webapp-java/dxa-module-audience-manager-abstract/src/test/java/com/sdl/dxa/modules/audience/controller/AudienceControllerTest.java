package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.validator.LoginFormValidator;
import com.sdl.dxa.modules.audience.security.AudienceManagerSecurityProvider;
import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.validation.FieldError;
import org.springframework.validation.MapBindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.servlet.mvc.support.RedirectAttributesModelMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AudienceControllerTest {

    @Mock
    private AudienceManagerSecurityProvider securityProvider;

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @Mock
    private LoginFormValidator loginFormValidator;

    @Mock
    private AudienceManagerService audienceManagerService;
    
    @InjectMocks
    private AudienceController controller;

    @Before
    public void init() {
        when(webRequestContext.getLocalization()).thenReturn(localization);

        when(localization.getPath()).thenReturn("path");
    }

    @Test
    public void shouldLoginSuccessfullyAndRedirect() {
        //given 
        LoginForm form = new LoginForm();
        RedirectAttributesModelMap map = new RedirectAttributesModelMap();
        MapBindingResult bindingResult = new MapBindingResult(new HashMap<String, Object>(), "loginForm");
        doReturn(true).when(securityProvider).validate(eq(form), any(HttpServletRequest.class), any(HttpServletResponse.class));

        //when
        String path = controller.login(form, bindingResult, map, new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertEquals("redirect:path", path);
    }

    @Test
    public void shouldFailIfLoginFormIsNotValid() {
        //given
        RedirectAttributesModelMap map = new RedirectAttributesModelMap();
        MapBindingResult bindingResult = new MapBindingResult(new HashMap<String, Object>(), "loginForm");
        bindingResult.addError(new FieldError("test", "test", "test"));
        LoginForm loginForm = new LoginForm();
        loginForm.setLoginFormUrl("url");

        //when
        String path = controller.login(loginForm, bindingResult, map, new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertEquals(bindingResult.getAllErrors(), map.getFlashAttributes().get("errors"));
        assertEquals("redirect:url", path);
    }

    @Test
    public void shouldFailRequestIfCannotLogin() {
        //given 
        RedirectAttributesModelMap map = new RedirectAttributesModelMap();
        MapBindingResult bindingResult = new MapBindingResult(new HashMap<String, Object>(), "loginForm");
        LoginForm loginForm = new LoginForm();
        when(securityProvider.validate(any(LoginForm.class), any(HttpServletRequest.class), any(HttpServletResponse.class))).thenReturn(false);

        //when
        controller.login(loginForm, bindingResult, map, new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertTrue(map.getFlashAttributes().containsKey("errors"));
        List<ObjectError> errors = (List<ObjectError>) map.getFlashAttributes().get("errors");
        assertEquals("login.failed", errors.get(0).getCode());
        assertTrue(errors.size() == 1);
    }

    @Test
    public void shouldLogoutAndRedirect() {
        //when
        String path = controller.logout(new MockHttpServletRequest(), new MockHttpServletResponse());

        //then
        assertEquals("redirect:path", path);
        verify(securityProvider).logout(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }
}