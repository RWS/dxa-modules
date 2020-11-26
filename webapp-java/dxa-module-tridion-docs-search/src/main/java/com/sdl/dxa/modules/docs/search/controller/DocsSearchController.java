package com.sdl.dxa.modules.docs.search.controller;

import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchResultSet;
import com.sdl.dxa.modules.docs.search.service.SearchService;
import com.sdl.dxa.performance.Performance;
import com.sdl.webapp.common.controller.exception.DocsExceptionHandler;
import com.sdl.webapp.common.impl.model.ErrorMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletContext;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Search Controller.
 * Contains MVC controller methods for Ish Search module functionality.
 */
@Slf4j
@Controller
public class DocsSearchController {
    /**
     * Regular expression to replace all markup spaces (including CR and NLF).
     * It is used to replace html/xml name into single line with only single valuable space.
     */
    private static final String MORE_THAN_ONE_SPACES = "(?ixm)\\s++";

    @Autowired
    private DocsExceptionHandler exceptionHandler;

    @Autowired
    private ServletContext context;

    @Autowired
    private SearchService searchProvider;

    @RequestMapping(method = POST, value = "/api/search")
    @ResponseBody
    public SearchResultSet search(@RequestBody String parametersJson) throws SearchException {
        if (parametersJson == null) {
            throw new IllegalArgumentException("Search parameters cannot be empty");
        }
        try (Performance perf = new Performance(1_000L,
                "search " + parametersJson.replaceAll(MORE_THAN_ONE_SPACES, ""))) {
            String namespace = context.getInitParameter("iq-namespace");
            String separator = context.getInitParameter("iq-field-separator");
            String language = context.getInitParameter("iq-default-language");

            return searchProvider.search(parametersJson, namespace, separator, language);
        }
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    ResponseEntity<ErrorMessage> handleException(Exception ex) {
        ErrorMessage message = exceptionHandler.handleException(ex);
        return new ResponseEntity(message, message.getHttpStatus());
    }
}
