package com.sdl.dxa.modules.audience.controller;

import com.sdl.dxa.modules.audience.model.LoginForm;
import com.sdl.dxa.modules.audience.model.validator.LoginFormValidator;
import com.sdl.dxa.modules.audience.service.SecurityProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.api.model.entity.RedirectEntity;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.sdl.webapp.common.controller.ControllerUtils.INCLUDE_PATH_PREFIX;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfileControllerTest {

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private SecurityProvider securityProvider;

    @Mock
    private Localization localization;

    @InjectMocks
    @Spy
    private ProfileController controller;

    @Before
    public void init() {
        when(webRequestContext.getLocalization()).thenReturn(localization);

        when(localization.getPath()).thenReturn("path");

        when(securityProvider.validate(eq("username"), eq("password"))).thenReturn(true);
        when(securityProvider.validate(eq("badName"), eq("badPassword"))).thenReturn(false);
    }

    @Test
    public void shouldAllowModelBindingOnlyInCaseOfPOSTRequest() {
        //given 
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");

        //then
        assertTrue(controller.modelBindingRequired(null, request));

        //when
        request.setMethod("GET");
        //then
        assertFalse(controller.modelBindingRequired(null, request));

        //when
        request.setMethod("PUT");
        //then
        assertFalse(controller.modelBindingRequired(null, request));

        //when
        request.setMethod("HEAD");
        //then
        assertFalse(controller.modelBindingRequired(null, request));
    }

    @Test
    public void shouldReturnValidator() {
        //when
        Validator validator = controller.dataBindValidator();

        //then
        assertNotNull(validator);
        assertEquals(LoginFormValidator.class, validator.getClass());
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
    public void shouldProcessPortRequestAndValidateBoundModelWithSuccessLogin() throws Exception {
        //given 
        LoginForm model = new LoginForm();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");
        request.setParameter("userName", "username");
        request.setParameter("password", "password");
        request.setParameter("rememberMe", "true");

        //when
        ViewModel viewModel = controller.enrichModel(model, request);

        //then
        assertNotNull(request.getAttribute("dataBinding"));
        assertEquals(RedirectEntity.class, viewModel.getClass());
        assertEquals("path", ((RedirectEntity) viewModel).getUrl());
        assertEquals("username", model.getUserName());
        assertEquals("password", model.getPassword());
        assertTrue(model.isRememberMe());

        verify(securityProvider).validate(eq("username"), anyString());
    }

    @Test
    public void shouldProcessPortRequestAndValidateBoundModelWithoutLogin() throws Exception {
        //given
        LoginForm model = new LoginForm();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");
        request.setParameter("userName", "badName");
        request.setParameter("password", "badPassword");

        //when
        ViewModel viewModel = controller.enrichModel(model, request);

        //then
        assertNotNull(request.getAttribute("dataBinding"));
        assertEquals(LoginForm.class, viewModel.getClass());
        BindingResult bindingResult = ((LoginForm) viewModel).getBindingResult();
        assertNotNull(bindingResult);
        assertTrue(bindingResult.getAllErrors().size() == 1);
        assertEquals("login.failed", bindingResult.getAllErrors().get(0).getCode());
        assertEquals(request.getAttribute("dataBinding"), bindingResult);

        verify(securityProvider).validate(eq("badName"), anyString());
    }

    @Test
    public void shouldSkipProcessingIfRequestIsGet() throws Exception {
        //given 
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        LoginForm model = new LoginForm();

        //when
        ViewModel viewModel = controller.enrichModel(model, request);

        //then
        verify(controller, times(2)).modelBindingRequired(eq(model), eq(request));
        verify(controller, never()).dataBindValidator();
        assertEquals(LoginForm.class, viewModel.getClass());
        assertNull(request.getAttribute("dataBinding"));
    }

    @Test
    public void shouldNotRedirectIfThereAreValidationErrors() throws Exception {
        //given 
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter("userName", "");
        request.setMethod("POST");
        LoginForm model = new LoginForm();

        //when
        ViewModel viewModel = controller.enrichModel(model, request);

        //then
        assertNotEquals(RedirectEntity.class, viewModel.getClass());
        assertTrue(controller.modelBindingRequired(model, request));
    }


}