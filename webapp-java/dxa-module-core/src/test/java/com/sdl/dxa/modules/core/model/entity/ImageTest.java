package com.sdl.dxa.modules.core.model.entity;

import com.sdl.webapp.common.exceptions.DxaException;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ImageTest {

    private Image image;

    @Before
    public void init() {
        image = new Image();
        image.setUrl("url");
    }

    // TSI-3044
    @Test(expected = DxaException.class)
    public void shouldNotRecursivelyCallToString_IfNull_InToHtmlElement() throws DxaException {
        //given
        image.setUrl(null);

        //when
        image.toHtmlElement("100%");

        //then
        // expect exception
    }

    // TSI-3044
    @Test(expected = DxaException.class)
    public void shouldNotRecursivelyCallToString_IfEmpty_InToHtmlElement() throws DxaException {
        //given
        image.setUrl("");

        //when
        image.toHtmlElement("100%");

        //then
        // expect exception
    }

    // TSI-3044
    @Test
    public void shouldNotRecursivelyCallToString_IfNull_InToString() {
        //given
        image.setUrl(null);

        //when
        String s = image.toString();

        //then
        assertEquals("", s);
    }

    // TSI-3044
    @Test
    public void shouldNotRecursivelyCallToString_IfEmpty_InToString() {
        //given
        image.setUrl("");

        //when
        String s = image.toString();

        //then
        assertEquals("", s);
    }

}