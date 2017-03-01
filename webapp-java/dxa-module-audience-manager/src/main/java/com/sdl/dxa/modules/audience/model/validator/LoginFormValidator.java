package com.sdl.dxa.modules.audience.model.validator;


import com.sdl.dxa.modules.audience.model.LoginForm;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class LoginFormValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return LoginForm.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        LoginForm form = (LoginForm) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "userName", "userName.empty", form.getNoUserNameMessage());
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "password.empty", form.getNoPasswordMessage());
    }
}
