package com.sdl.dxa.modules.ugc.model.validator;

import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

/**
 * <p>Validator, validating Ugc comment Posts</p>
 */
@Component
public class UgcPostCommentFormValidator implements Validator {

    /**
     *
     * @param clazz supported form  model class
     * @return True/False
     */
    @Override
    public boolean supports(Class<?> clazz) {
        return UgcPostCommentForm.class.isAssignableFrom(clazz);
    }

    /**
     * <p>Validates posted form</p>
     *
     * @param target form to validate
     * @param errors errors found during validation
     */
    @Override
    public void validate(Object target, Errors errors) {
        final UgcPostCommentForm form = (UgcPostCommentForm) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "userName", "userName.empty", form.getNoUserNameMessage());
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "emailAddress", "emailAddress.empty", form.getNoEmailAddressMessage());
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "content", "content.empty", form.getNoContentMessage());
    }
}
