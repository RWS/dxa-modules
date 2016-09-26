package com.sdl.dxa.modules.audience.model.validator;

import com.sdl.dxa.modules.audience.model.LoginForm;
import org.junit.Test;
import org.springframework.validation.BeanPropertyBindingResult;

import static junit.framework.TestCase.assertFalse;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class LoginFormValidatorTest {

    private LoginFormValidator validator = new LoginFormValidator();

    @Test
    public void shouldSupportOnlyLoginForm() {
        assertTrue(validator.supports(LoginForm.class));
        assertFalse(validator.supports(Object.class));
    }

    @Test
    public void shouldValidateLoginFormPositive() {
        //given 
        LoginForm form = new LoginForm();
        form.setUserName("user");
        form.setPassword("pass");
        BeanPropertyBindingResult errors = new BeanPropertyBindingResult(form, "login");

        //when
        validator.validate(form, errors);

        //then
        assertFalse(errors.hasErrors());
    }

    @Test
    public void shouldValidateLoginFormNegative() {
        //given
        LoginForm form = new LoginForm();
        form.setNoPasswordMessage("noPass");
        form.setNoUserNameMessage("noUser");
        BeanPropertyBindingResult errors = new BeanPropertyBindingResult(form, "login");

        //when
        validator.validate(form, errors);

        //then
        assertTrue(errors.hasErrors());
        assertTrue(errors.getAllErrors().size() == 2);
        assertEquals("noUser", errors.getFieldError("userName").getDefaultMessage());
        assertEquals("noPass", errors.getFieldError("password").getDefaultMessage());

    }
}