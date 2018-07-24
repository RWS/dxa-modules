package com.sdl.dxa.modules.ugc.model.validator;

import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UgcPostCommentFormValidatorTest {

    @Mock
    private UgcPostCommentFormValidator ugcPostCommentFormValidator;

    @Test
    public void shouldSupportUgcPostCommentFormClass() {
        //given
        ugcPostCommentFormValidator = new UgcPostCommentFormValidator();
        //when
        boolean result = ugcPostCommentFormValidator.supports(UgcPostCommentForm.class);
        //then
        Assert.assertTrue(result);
    }

    @Test
    public void shouldNotSupportOtherClass() {
        //given
        ugcPostCommentFormValidator = new UgcPostCommentFormValidator();
        //when
        boolean result = ugcPostCommentFormValidator.supports(Object.class);
        //then
        Assert.assertFalse(result);
    }

    @Test
    public void shouldFailOnValidation() {
        //given
        ugcPostCommentFormValidator = new UgcPostCommentFormValidator();
        UgcPostCommentForm ugcPostCommentForm = mock(UgcPostCommentForm.class);
        BindingResult bindingResult = new BeanPropertyBindingResult(ugcPostCommentForm, "Test");

        //when
        ugcPostCommentFormValidator.validate(ugcPostCommentForm, bindingResult);
        //then
        Assert.assertEquals(bindingResult.getErrorCount(), 3);
    }

    @Test
    public void shouldSucceedOnValidation() {
        //given
        ugcPostCommentFormValidator = new UgcPostCommentFormValidator();
        UgcPostCommentForm ugcPostCommentForm = mock(UgcPostCommentForm.class);
        BindingResult bindingResult = new BeanPropertyBindingResult(ugcPostCommentForm, "Test");
        when(ugcPostCommentForm.getUserName()).thenReturn("userName");
        when(ugcPostCommentForm.getEmail()).thenReturn("test@test.com");
        when(ugcPostCommentForm.getContent()).thenReturn("message");

        //when
        ugcPostCommentFormValidator.validate(ugcPostCommentForm, bindingResult);

        //then
        Assert.assertEquals(bindingResult.getErrorCount(), 0);
    }

}