package com.sdl.dxa.modules.docs.search.controller;

import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchResultSet;
import com.sdl.dxa.modules.docs.search.service.SearchService;
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

import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Search Controller.
 * Contains MVC controller methods for Ish Search module functionality.
 */
@Slf4j
@Controller
public class DocsSearchController {

    @Autowired
    private DocsExceptionHandler exceptionHandler;

    @Autowired
    private SearchService searchProvider;

    @RequestMapping(method = POST, value = "/api/search")
    @ResponseBody
    public SearchResultSet search(@RequestBody String parametersJson) throws SearchException {
        return searchProvider.search(parametersJson);
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    ResponseEntity<ErrorMessage> handleException(Exception ex) {
        ErrorMessage message = exceptionHandler.handleException(ex);
        return new ResponseEntity(message, message.getHttpStatus());
    }
}
