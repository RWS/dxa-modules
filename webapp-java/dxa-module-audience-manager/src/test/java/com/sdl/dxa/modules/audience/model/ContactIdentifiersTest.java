package com.sdl.dxa.modules.audience.model;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ContactIdentifiersTest {

    @Test
    public void shouldReturnAnArrayOfKeyAndImportSource() {
        //given 
        ContactIdentifiers identifiers = new ContactIdentifiers("key", "DXA");

        //when
        String[] ids = identifiers.getIdentifiers();

        //then
        assertEquals("key", ids[0]);
        assertEquals("DXA", ids[1]);
    }

    @Test
    public void shouldReturnAnArrayOnlyOfKeyIfImportSourceIsEmptyOrNull() {
        //given
        ContactIdentifiers empty = new ContactIdentifiers("key", "");
        ContactIdentifiers nl = new ContactIdentifiers("key", null);

        //when
        String[] idsEmpty = empty.getIdentifiers();
        String[] idsNull = nl.getIdentifiers();

        //then
        assertEquals("key", idsEmpty[0]);
        assertEquals("key", idsNull[0]);
        assertEquals(1, idsEmpty.length);
        assertEquals(1, idsNull.length);
    }
}