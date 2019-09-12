package com.sdl.dxa.modules.dd.controller;

import com.sdl.dxa.modules.ish.controller.MainController;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Main controller.
 */
@Controller
@Profile("dxa.docs.enabled")
@Primary
public class DynamicDocumentationPageController extends BaseController {

    @Autowired
    private MainController mainController;

    @RequestMapping(value = {"/"}, method = GET)
    public String home(HttpServletRequest request) throws ContentProviderException {
        return mainController.home();
    }
}
