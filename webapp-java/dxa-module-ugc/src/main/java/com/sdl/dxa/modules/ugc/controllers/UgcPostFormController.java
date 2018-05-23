package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import com.sdl.dxa.modules.ugc.model.validator.UgcPostCommentFormValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * <p>Ugc API controller that handles  requests to <code>/api/ugc/postcomment</code>.</p>
 */
@Controller
@RequestMapping(value = {"/api/ugc", "/{path}/api/ugc"})
@Slf4j
public class UgcPostFormController {

    private static final String REDIRECT_PREFIX = "redirect:";

    private final UgcPostCommentFormValidator ugcPostCommentFormValidator;

    @Autowired
    private UgcService ugcService;

    @Autowired
    public UgcPostFormController(UgcPostCommentFormValidator ugcPostCommentFormValidator) {
        this.ugcPostCommentFormValidator = ugcPostCommentFormValidator;
    }

    /**
     * <p>handles post comment request</p>
     * <p>listens to <code>/api/ugc/postcomment</code>.</p>
     *
     * @param form               Posted Comment form
     * @param bindingResult      represents binding results
     * @param redirectAttributes Redirect attributes
     * @return redirect url
     */
    @RequestMapping(value = "/postcomment", method = RequestMethod.POST)
    public String postComment(@ModelAttribute("entity") UgcPostCommentForm form, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        ugcPostCommentFormValidator.validate(form, bindingResult);

        if (bindingResult.hasErrors()) {
            log.trace("Comment Form for {} has {} errors", form.getTarget(), bindingResult.getErrorCount());
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());
            return REDIRECT_PREFIX + form.getFormUrl();
        }
        log.trace("Comment Form for {} complete and valid",form.getTarget());

        ugcService.postComment(form.getTarget().getPublicationId(), form.getTarget().getItemId(), form.getUserName(),
                form.getEmailAddress(), form.getContent(), form.getParentId(), form.getMetadata());

        log.trace("Comment on {} by {} posted succesful", form.getTarget(),form.getUserName());
        return REDIRECT_PREFIX + form.getFormUrl();
    }

}
