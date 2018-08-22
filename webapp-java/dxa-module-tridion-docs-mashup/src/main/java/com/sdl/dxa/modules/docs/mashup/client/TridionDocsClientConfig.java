package com.sdl.dxa.modules.docs.mashup.client;

import com.sdl.web.client.configuration.api.ConfigurationException;
import com.sdl.web.client.impl.OAuthTokenProvider;
import com.sdl.web.content.client.configuration.impl.ContentServiceClientConfigurationLoader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class TridionDocsClientConfig extends ContentServiceClientConfigurationLoader {

    private OAuthTokenProvider _oAuthTokenProvider;
    private String _graphQLEndpoint;


    public TridionDocsClientConfig() throws ConfigurationException, UnsupportedEncodingException {
        _oAuthTokenProvider = new OAuthTokenProvider(getOauthTokenProviderConfiguration());
        _graphQLEndpoint = getServiceUrl().replace("content.svc", "udp/content");
    }

    public String getGraphQLEndpoint() {
        return _graphQLEndpoint;
    }

    public String getAuthRequestHeaderName() {
        return "authorization";

    }

    public String getAuthRequestHeaderValue() throws UnsupportedEncodingException {
        String encodedHeaderValue = URLEncoder.encode(_oAuthTokenProvider.getToken(), "UTF-8");
        return "Bearer " + encodedHeaderValue;
    }

}
