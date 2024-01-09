package com.sdl.dxa.modules.context.model;

import com.google.common.collect.Sets;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ConditionsTest {

    @Test
    public void shouldIsEmpty() throws Exception {
        assertTrue(new Conditions(null, null).isEmpty());
        assertTrue(new Conditions(null, Collections.emptySet()).isEmpty());
        assertTrue(new Conditions(Collections.emptySet(), null).isEmpty());
        assertTrue(new Conditions(Collections.emptySet(), Collections.emptySet()).isEmpty());

        assertFalse(new Conditions(null, Sets.newHashSet("test")).isEmpty());
        assertFalse(new Conditions(Sets.newHashSet("test"), null).isEmpty());
        assertFalse(new Conditions(Sets.newHashSet("test"), Sets.newHashSet("test")).isEmpty());
    }

}