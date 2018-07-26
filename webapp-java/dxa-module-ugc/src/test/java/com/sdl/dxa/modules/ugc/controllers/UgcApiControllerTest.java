package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.data.PostedComment;
import com.sdl.dxa.modules.ugc.data.User;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.localization.Localization;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMapOf;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@ActiveProfiles("test")
public class UgcApiControllerTest {

    private static final int PAGE_ID = 12451;
    private static final int PUBLICATION_ID = 4574;
    private static final String COMMENT_TEXT = "comment";
    private static final String USER_EMAIL = "emailAddress";
    private static final String USER_NAME = "name";

    @Mock
    private WebRequestContext webRequestContext;

    @Mock
    private Localization localization;

    @Mock
    private List<Comment> comments;

    @Mock
    private Comment comment;

    @Mock
    private UgcService ugcService;

    @InjectMocks
    @Spy
    private UgcApiController ugcApiController;

    @Before
    public void init() {
        comments = new ArrayList<>();
        when(webRequestContext.getLocalization()).thenReturn(localization);
        when(localization.getPath()).thenReturn("path");
        when(ugcService.getComments(any(int.class), any(int.class), any(boolean.class), any(Integer[].class), any(int.class), any(int.class))).thenReturn(comments);
        when(ugcService.postComment(any(int.class), any(int.class), any(String.class), any(String.class),
                any(String.class), any(int.class), anyMapOf(String.class,String.class))).thenReturn(comment);
    }

    /**
     *
     */
    @Test
    public void shouldReturnComments() {
        //given
        //when
        List<Comment> retrievedComments = ugcApiController.getComments(PUBLICATION_ID, PAGE_ID, false, null, 0, 0);

        //then
        assertEquals(comments, retrievedComments);
    }

    @Test
    public void testPostComment() {
        //given
        PostedComment postedComment = mock(PostedComment.class);
        User user= mock(User.class);

        when(postedComment.getUserName()).thenReturn(USER_NAME);
        when(postedComment.getEmail()).thenReturn(USER_EMAIL);
        when(postedComment.getContent()).thenReturn(COMMENT_TEXT);
        when(comment.getUser()).thenReturn(user);
        when(user.getName()).thenReturn(USER_NAME);
        when(user.getEmailAddress()).thenReturn(USER_EMAIL);
        when(comment.getContent()).thenReturn(COMMENT_TEXT);
        when(postedComment.getParentId()).thenReturn("0");

        //when
        Comment result = ugcApiController.postComment(postedComment);
        //then
        assertEquals(USER_NAME, result.getUser().getName());
        assertEquals(USER_EMAIL, result.getUser().getEmailAddress());

    }
}