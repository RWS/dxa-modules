package com.sdl.dxa.modules.context.model;

import lombok.Value;

import java.util.Set;

@Value
public class Conditions {

    private Set<String> includes;

    private Set<String> excludes;

    public boolean isEmpty() {
        return includes == null && excludes == null ||
                ((includes == null || includes.isEmpty()) && (excludes == null || excludes.isEmpty()));
    }
}
