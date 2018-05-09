package com.sdl.dxa.modules.ugc.controllers;

import com.sdl.dxa.modules.ugc.UgcService;
import com.sdl.dxa.modules.ugc.model.entity.UgcComment;
import com.sdl.dxa.modules.ugc.model.entity.UgcComments;
import com.sdl.webapp.common.api.model.ViewModel;
import com.tridion.util.TCMURI;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UgControllerTest {

    @Mock
    private UgcService ugcService;

    @Mock
    private List<UgcComment> ugcComments;
    @InjectMocks
    @Spy
    private UgcController controller;

    @Test
    public void shouldIgnoreModelIfItIsNotUgcComments() throws Exception {
        //given
        ViewModel model = mock(ViewModel.class);

        //when
        controller.enrichModel(model, null);

        //then
        verifyZeroInteractions(model);
    }

    @Test
    public void shouldProcessModelIfItIsUgcComments() throws Exception {
        //given
        UgcComments model = mock(UgcComments.class);
        ugcComments = new ArrayList<>();
        when(model.getTarget()).thenReturn(new TCMURI("tcm:1-2-16"));
        when(model.getComments()).thenReturn(ugcComments);
        when(ugcService.getComments(any(int.class), any(int.class), any(boolean.class), any(Integer[].class), any(int.class), any(int.class))).thenReturn(new ArrayList<>());

        //when
        ViewModel result = controller.enrichModel(model, null);

        //then
        assertEquals(model.getClass(),result.getClass());
    }
}