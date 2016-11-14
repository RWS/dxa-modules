package com.sdl.delivery.ish.webapp.module.controller;

import com.sdl.delivery.ish.webapp.module.model.HelloModel;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Controller for Dita Module.
 */
@Controller
public class DitaController {

    /**
     * Hello world request mapping.
     */
    @RequestMapping(value = "/api/helloworld", method = GET, produces = "application/json")
    @ResponseBody
    public HelloModel helloworld() {
        return new HelloModel();
    }

}
