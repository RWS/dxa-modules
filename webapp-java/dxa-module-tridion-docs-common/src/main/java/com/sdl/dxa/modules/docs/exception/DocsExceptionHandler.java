package com.sdl.dxa.modules.docs.exception;

import com.sdl.dxa.modules.docs.model.ErrorMessage;
import org.springframework.beans.TypeMismatchException;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * IshExceptionHandler class.
 */
@Component
public class DocsExceptionHandler {

    public ErrorMessage handleException(Exception ex) {
        ResponseStatus annotation = AnnotationUtils.findAnnotation(ex.getClass(), ResponseStatus.class);
        String message = ex.getMessage();
        if (message == null) {
            // Put the type on the message
            message = ex.getClass().getName();
        }

        if (annotation != null) {
            return new ErrorMessage(message, annotation.value());
        } else {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            // Happens when input params are of an invalid data type
            if (ex instanceof TypeMismatchException || ex instanceof SearchParametersProcessingException) {
                status = HttpStatus.BAD_REQUEST;
            }
            return new ErrorMessage(message, status);
        }
    }
}
