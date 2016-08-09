package com.sdl.knowledgecenter;

import org.springframework.stereotype.Service;

@Service
public class MainService {
    public String hello() {
        return "Hello, web-app!";
    }
}
