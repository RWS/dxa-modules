package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.model.entity.UgcComment;
import com.sdl.dxa.modules.ugc.model.entity.UgcComments;
import com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.EntityController;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UgcController extends EntityController {

    private static List<UgcComment> createEntities(List<Comment> comments) {

        final List<UgcComment> ugcComments = new ArrayList<>();
        comments.forEach((Comment comment) -> ugcComments.add(createEntity(comment)));
        return ugcComments;
    }

    private static UgcComment createEntity(Comment comment) {
        final UgcComment ugcComment = new UgcComment();
        ugcComment.setComments(createEntities(comment.getChildren()));
        ugcComment.setCommentData(comment);
        return ugcComment;
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {

        if (model instanceof UgcComments) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            final UgcService ugcService = new UgcService(context);
            final UgcComments ugcComments = (UgcComments) (enrichedModel instanceof EntityModel ? enrichedModel : model);
            final List<Comment> comments = ugcService.getComments(ugcComments.getTarget().getPublicationId(),
                    ugcComments.getTarget().getItemId(), false, new Integer[0], 0, 0);
            ugcComments.setComments(createEntities(comments));
            return ugcComments;
        }

        if (model instanceof UgcPostCommentForm) {
            final ViewModel enrichedModel = super.enrichModel(model, request);
            final UgcPostCommentForm postForm = (UgcPostCommentForm) (enrichedModel instanceof EntityModel ? enrichedModel : model);
            postForm.setFormUrl(context.getPage().getUrl());

        }
        return model;
    }
}
