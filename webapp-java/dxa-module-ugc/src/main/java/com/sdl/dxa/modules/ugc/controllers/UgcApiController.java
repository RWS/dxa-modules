package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.controller.BaseController;
import com.sdl.webapp.common.controller.ControllerUtils;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping(value = { "/api/comments", "/{path}/api/comments"})
@Slf4j
public class UgcApiController extends BaseController{
}
