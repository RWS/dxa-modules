package com.sdl.dxa.modules.ugc.model.validator;

import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class UgcPostCommentFormValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return UgcPostCommentForm.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        UgcPostCommentForm form = (UgcPostCommentForm) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "userName", "userName.empty", form.getNoUserNameMessage());
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "emailAddress", "emailAddress.empty", form.getNoEmailAddressMessage());
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "content", "content.empty", form.getNoContentMessage());
    }
}
