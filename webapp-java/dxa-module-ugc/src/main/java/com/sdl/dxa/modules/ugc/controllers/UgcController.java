package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.model.entity.UgcComment;
import com.sdl.dxa.modules.ugc.model.entity.UgcComments;
import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.EntityController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UgcController extends EntityController {

    private final WebRequestContext webRequestContext;

    @Autowired
    public UgcController(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    private static List<UgcComment> CreateEntities(List<Comment> comments) {

        List<UgcComment> ugcComments = new ArrayList<>();
        comments.forEach((Comment comment) -> ugcComments.add(CreateEntity(comment)));
        return ugcComments;
    }

    private static UgcComment CreateEntity(Comment comment) {
        UgcComment ugcComment = new UgcComment();
        ugcComment.setComments(CreateEntities(comment.getChildren()));
        ugcComment.setCommentData(comment);
        return ugcComment;
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        if (model instanceof UgcComments) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            UgcService ugcService = new UgcService(context);
            UgcComments ugcComments = (UgcComments) (enrichedModel instanceof EntityModel ? enrichedModel : model);
            List<Comment> comments = ugcService.GetComments(ugcComments.getTarget().getPublicationId(),
                    ugcComments.getTarget().getItemId(), false, new ArrayList<>(), 0, 0);
            ugcComments.setComments(CreateEntities(comments));
            return ugcComments;
        }

        if (model instanceof UgcPostCommentForm) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            UgcPostCommentForm postForm = (UgcPostCommentForm) (enrichedModel instanceof EntityModel ? enrichedModel : model);
            postForm.setFormUrl(webRequestContext.getPage().getUrl());

        }
        return model;
    }
}
