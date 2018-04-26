package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import com.sdl.dxa.modules.ugc.model.validator.UgcPostCommentFormValidator;
import com.sdl.webapp.common.api.WebRequestContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value = {"/api/ugc", "/{path}/api/ugc"})
@Slf4j
public class UgcPostFormController {

    private static final String REDIRECT_PREFIX = "redirect:";

    private final WebRequestContext webRequestContext;
    private final UgcPostCommentFormValidator ugcPostCommentFormValidator;

    @Autowired
    public UgcPostFormController(WebRequestContext webRequestContext,
                         UgcPostCommentFormValidator ugcPostCommentFormValidator) {
        this.webRequestContext = webRequestContext;
        this.ugcPostCommentFormValidator = ugcPostCommentFormValidator;
    }

    @RequestMapping(value = "/postcomment", method = RequestMethod.POST)
    public String postComment(@ModelAttribute("entity") UgcPostCommentForm form, BindingResult bindingResult, RedirectAttributes redirectAttributes,
                        HttpServletRequest request, HttpServletResponse response) {
        ugcPostCommentFormValidator.validate(form, bindingResult);

        if (bindingResult.hasErrors()) {
            log.trace("Comment Form has {} errors",bindingResult.getErrorCount());
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());
            return REDIRECT_PREFIX + form.getFormUrl();
        }
            log.trace("Comment Form complete and valid");

            UgcService ugcService = new UgcService(webRequestContext);
            ugcService.postComment(form.getTarget().getPublicationId(), form.getTarget().getItemId(), form.getUserName(),
                    form.getEmailAddress(), form.getContent(), form.getParentId(), form.getMetadata());

        log.trace("Comment posted succesful {}", form.getUserName());
        return REDIRECT_PREFIX + form.getFormUrl();
    }

}
