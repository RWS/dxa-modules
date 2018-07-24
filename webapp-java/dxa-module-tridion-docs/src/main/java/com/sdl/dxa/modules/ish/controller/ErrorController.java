package com.sdl.dxa.modules.ish.controller;

import com.sdl.dxa.modules.ish.model.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_INTERNAL_SERVER_ERROR;

/**
 * Handles errors that can occur in application.
 */
@Controller
public class ErrorController {

    @RequestMapping(value = "error", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ErrorMessage> renderErrorJson(HttpServletRequest httpRequest) {
        int httpErrorCode = getErrorCode(httpRequest);
        String errorMsg = getErrorMessage(httpRequest);

        ErrorMessage message = new ErrorMessage(errorMsg, HttpStatus.valueOf(httpErrorCode));
        return new ResponseEntity<>(message, message.getHttpStatus());
    }

    @RequestMapping(value = "error", method = RequestMethod.GET)
    public ModelAndView renderErrorPage(HttpServletRequest httpRequest) {
        ModelAndView errorPage = new ModelAndView("errorPage");
        int httpErrorCode = getErrorCode(httpRequest);
        String errorMsg = getErrorMessage(httpRequest);

        errorPage.addObject("errorMsg", errorMsg);
        errorPage.addObject("statusCode", httpErrorCode);

        return errorPage;
    }

    private String getErrorMessage(HttpServletRequest httpRequest) {
        String errorMsg = "";
        String detailErrorMsg = getExceptionMessage(httpRequest);
        int httpErrorCode = getErrorCode(httpRequest);

        switch (httpErrorCode) {
            case SC_BAD_REQUEST:
                errorMsg = "Http Error Code: 400. Bad Request.";
                break;
            case SC_UNAUTHORIZED:
                errorMsg = "Http Error Code: 401. Unauthorized.";
                break;
            case SC_NOT_FOUND:
                errorMsg = "Http Error Code: 404. Resource not found.";
                break;
            case SC_INTERNAL_SERVER_ERROR:
                errorMsg = "Http Error Code: 500. Internal Server Error.";
                break;
            default:
                errorMsg = "Internal error happened.";
        }

        if (detailErrorMsg != null) {
            errorMsg += " " + detailErrorMsg;
        }
        return errorMsg;
    }

    private int getErrorCode(HttpServletRequest httpRequest) {
        return (Integer) httpRequest
                .getAttribute("javax.servlet.error.status_code");
    }

    private String getExceptionMessage(HttpServletRequest httpRequest) {
        Exception ex = (Exception) httpRequest
                .getAttribute("javax.servlet.error.exception");
        if (ex != null) {
            return ex.getMessage();
        }
        return null;
    }
}
