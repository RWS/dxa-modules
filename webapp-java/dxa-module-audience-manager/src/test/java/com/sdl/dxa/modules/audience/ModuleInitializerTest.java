package com.sdl.dxa.modules.audience;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ModuleInitializerTest {

    @Test
    public void shouldGetAreaName() throws Exception {
        assertEquals("AudienceManager", new AudienceManagerInitializer.ModuleInitializer().getAreaName());
    }

}