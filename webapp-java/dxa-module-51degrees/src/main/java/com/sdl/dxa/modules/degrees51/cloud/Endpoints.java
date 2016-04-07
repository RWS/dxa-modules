package com.sdl.dxa.modules.degrees51.cloud;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class Endpoints {
    @Value("${dxa.modules.51degrees.license}")
    private String licenseKey;

    @Value("${dxa.modules.51degrees.endpoint}")
    private String endpoint;

    @Value("${dxa.modules.51degrees.endpoint.match}")
    private String match;

    private String baseUrl;

    @PostConstruct
    private void init() {
        this.endpoint = normalize(this.endpoint);
        this.licenseKey = normalize(this.licenseKey);
        this.match = normalize(this.match);

        this.baseUrl = this.endpoint + this.licenseKey;
    }

    private String normalize(String endpoint) {
        return endpoint.endsWith("/") ? endpoint : endpoint + "/";
    }

    public String match() {
        return this.baseUrl + this.match;
    }

}
