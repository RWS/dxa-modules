package com.sdl.webapp.cid;

import com.sdl.webapp.common.api.MediaHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

@Component
@Primary
@Slf4j
public class CidResponsiveMediaUrlBuilder implements MediaHelper.ResponsiveMediaUrlBuilder {

    @Autowired
    private HttpServletRequest servletRequest;

    @Value("${dxa.modules.cid.mapping}")
    private String mapping;

    @Value("${dxa.modules.cid.appHostMapping:#{null}}")
    private String appHostMapping;

    @PostConstruct
    private void init() {
        if (this.mapping == null) {
            this.mapping = "/cid";
            log.warn("CID mapping is not set via dxa.modules.cid.mapping, fallback to default {}", this.mapping);
            return;
        }
        if (this.mapping.endsWith("/")) {
            this.mapping = this.mapping.substring(0, this.mapping.length() - 1);
        }
        if (this.mapping.endsWith("/*")) {
            this.mapping = this.mapping.substring(0, this.mapping.length() - 2);
        }
    }

    @Override
    public Builder newInstance() {
        return new CidBuilder(servletRequest, mapping, appHostMapping);
    }

    private static class CidBuilder extends Builder {

        private HttpServletRequest servletRequest;

        private String mapping;

        private String appHostMapping;

        private CidBuilder(HttpServletRequest servletRequest, String mapping, String appHostMapping) {
            this.servletRequest = servletRequest;
            this.mapping = mapping;
            this.appHostMapping = appHostMapping;
        }

        @Override
        public String buildInternal() {
            String localName = servletRequest.getServerName();

            if (isIPv6Localhost(localName)) {
                localName = "localhost";
            }

            String hostname = this.appHostMapping != null ? this.appHostMapping :
                    localName + ':' + servletRequest.getServerPort();

            return String.format("%s/scale/%sx%s/%s%s",
                    mapping,
                    getWidth(),
                    isZeroAspect() ? "" : getHeight(),
                    hostname,
                    getBaseUrl());
        }

        private boolean isIPv6Localhost(String localName) {
            return "0:0:0:0:0:0:0:1".equals(localName) || "::1".equals(localName) || "0000:0000:0000:0000:0000:0000:0000:0001".equals(localName);
        }
    }
}
