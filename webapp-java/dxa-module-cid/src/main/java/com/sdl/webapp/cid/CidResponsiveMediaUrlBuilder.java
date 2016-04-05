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
public class CidResponsiveMediaUrlBuilder extends MediaHelper.ResponsiveMediaUrlBuilder {

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
            String hostname = this.appHostMapping != null ? this.appHostMapping :
                    servletRequest.getLocalName() + ':' + servletRequest.getServerPort();

            return String.format(mapping + "/scale/%sx%s/%s%s",
                    getWidth(),
                    isZeroAspect() ? "" : getHeight(),
                    hostname,
                    getBaseUrl());
        }
    }
}
