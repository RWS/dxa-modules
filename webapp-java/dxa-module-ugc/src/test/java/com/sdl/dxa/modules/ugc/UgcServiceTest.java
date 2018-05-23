package com.sdl.dxa.modules.ugc;

import com.sdl.delivery.ugc.client.comment.UgcCommentApi;
import com.sdl.dxa.modules.ugc.data.Comment;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMapOf;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UgcServiceTest {


    @Mock
    private UgcCommentApi ugcCommentApi;

    @Mock
    private Comment comment;

    @Mock
    private UgcService ugcService;

    @Test
    public void shouldProcessGetComments() {
        //given
        List<Comment> comments = new ArrayList<>();
        comments.add(comment);
        when(ugcService.getComments(any(int.class), any(int.class), any(boolean.class), any(Integer[].class), any(int.class), any(int.class))).thenReturn(comments);

        //when
        List<Comment> result = ugcService.getComments(1,1,false,new Integer[]{},0,0);

        //then
        Assert.assertEquals(result,comments);

    }

    @Test
    public void shouldProcessPostComment(){
        //given
        when(ugcService.postComment(any(int.class), any(int.class), any(String.class), any(String.class), any(String.class), any(int.class), anyMapOf(String.class, String.class))).thenReturn(comment);

        //when
        Comment result = ugcService.postComment(1,1,"userName","test@test.com","message",0, new HashMap<>());

        //then
        Assert.assertEquals(result,comment);
    }
}