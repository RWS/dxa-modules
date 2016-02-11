package com.sdl.webapp.cid;

import com.sdl.webapp.common.api.MediaHelper;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
@Primary
public class CidResponsiveMediaUrlBuilder extends MediaHelper.ResponsiveMediaUrlBuilder {

    @Autowired
    private HttpServletRequest servletRequest;

    @Override
    public Builder newInstance() {
        return new CidBuilder(servletRequest);
    }

    private static class CidBuilder extends Builder {
        private HttpServletRequest servletRequest;

        private CidBuilder(HttpServletRequest servletRequest) {
            this.servletRequest = servletRequest;
        }

        @Override
        @SneakyThrows(UnknownHostException.class)
        public String buildInternal() {
            String hostname = InetAddress.getLocalHost().getCanonicalHostName() + ':' + servletRequest.getServerPort();

            String cidServiceUrl = servletRequest.getServletContext().getInitParameter("cidUrl");

            return String.format("%s/scale/%sx%s/%s%s",
                    cidServiceUrl,
                    getWidth(),
                    isZeroAspect() ? "" : getHeight(),
                    hostname,
                    getBaseUrl());
        }
    }
}
