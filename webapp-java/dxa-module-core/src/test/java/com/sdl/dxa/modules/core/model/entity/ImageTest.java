package com.sdl.dxa.modules.core.model.entity;

import com.sdl.webapp.common.exceptions.DxaException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ImageTest {

    private Image image;

    @BeforeEach
    public void init() {
        image = new Image();
        image.setUrl("url");
    }

    // TSI-3044
    @Test
    public void shouldNotRecursivelyCallToString_IfNull_InToHtmlElement() throws DxaException {
        Assertions.assertThrows(DxaException.class, () -> {
            // Given
            image.setUrl(null);

            // When
            image.toHtmlElement("100%");

            // Then expect exception
        });
    }

    // TSI-3044
    @Test
    public void shouldNotRecursivelyCallToString_IfEmpty_InToHtmlElement() throws DxaException {
        Assertions.assertThrows(DxaException.class, () -> {
            // Given
            image.setUrl("");

            // When
            image.toHtmlElement("100%");

            // Then expect exception
        });
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