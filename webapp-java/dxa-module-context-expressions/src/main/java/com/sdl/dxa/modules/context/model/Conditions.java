package com.sdl.dxa.modules.context.model;

import lombok.Value;

import java.util.Set;

@Value
public class Conditions {

    private Set<String> includes;

    private Set<String> excludes;
}
