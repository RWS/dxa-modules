package com.sdl.dxa.modules.ugc.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.data.PostedComment;
import com.sdl.dxa.modules.ugc.data.PubIdTitleLang;
import com.sdl.webapp.common.controller.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;


@Controller
@RequestMapping(value = {"/api/comments", "/{path}/api/comments"})
@Slf4j
public class UgcApiController extends BaseController {

    @RequestMapping(method = GET, value = "/{publicationId}/{pageId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Comment> getComments(@PathVariable("publicationId") Integer publicationId,
                                        @PathVariable("pageId") Integer pageId,
                                        @RequestParam(value = "descending",
                                                required = false,
                                                defaultValue = "false") Boolean descending,
                                        @RequestParam(value = "status[]",
                                                required = false,
                                                defaultValue = "0") Integer[] status,
                                        @RequestParam(value = "top",
                                                required = false,
                                                defaultValue = "0") Integer top,
                                        @RequestParam(value = "skip",
                                                required = false,
                                                defaultValue = "0") Integer skip) {
        final UgcService ugcService = new UgcService(context);
        return ugcService.getComments(publicationId, pageId, descending, status, top, skip);
    }

    @RequestMapping(method = POST, value = "/add",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Comment postComment(@RequestBody PostedComment input) {
        final UgcService ugcService = new UgcService(context);
        Map<String, String> metadata = new HashMap<>();
        metadata.put("publicationTitle", input.getPublicationTitle());
        metadata.put("publicationUrl", input.getPublicationUrl());
        metadata.put("itemTitle", input.getPageTitle());
        metadata.put("itemUrl", input.getPageUrl());
        metadata.put("language", input.getLanguage());
        metadata.put("status", "0");

        addPubIdTitleLangToCommentMetadata(input, metadata);

        return ugcService.postComment(input.getPublicationId(),
                input.getPageId(),
                input.getUsername(),
                input.getEmail(),
                input.getContent(),
                input.getParentId(),
                metadata);
    }

    @RequestMapping("/upvote")
    public String upVoteComment(@RequestParam(value = "commentId",
            required = false,
            defaultValue = "0") Integer commentId) {
        final UgcService ugcService = new UgcService(context);
        ugcService.upVoteComment(commentId);
        return String.format("redirect:%s",context.getFullUrl());
    }

    @RequestMapping("/downvote")
    public String downVoteComment(@RequestParam(value = "commentId",
            required = false,
            defaultValue = "0") Integer commentId) {
        final UgcService ugcService = new UgcService(context);
        ugcService.downVoteComment(commentId);
        return String.format("redirect:%s",context.getFullUrl());
    }

    private void addPubIdTitleLangToCommentMetadata(@RequestBody PostedComment input, Map<String, String> metadata) {
        PubIdTitleLang pubIdTitleLang = new PubIdTitleLang();
        pubIdTitleLang.setId(input.getPublicationId());
        pubIdTitleLang.setLang(input.getLanguage());
        pubIdTitleLang.setTitle(input.getPublicationTitle());

        Gson gSon = new GsonBuilder().create();
        String pubIdTitleLangJson = gSon.toJson(pubIdTitleLang);

        metadata.put("pubIdTitleLang", pubIdTitleLangJson);
    }

}
