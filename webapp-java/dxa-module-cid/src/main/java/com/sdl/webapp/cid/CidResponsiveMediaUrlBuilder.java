package com.sdl.webapp.cid;

import com.sdl.webapp.common.api.MediaHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class CidResponsiveMediaUrlBuilder extends MediaHelper.ResponsiveMediaUrlBuilder {

    @Autowired
    private MediaHelper.ResponsiveMediaUrlBuilder.HostsNamesProvider hostsNamesProvider;

    @Override
    public Builder newInstance() {
        return new CidBuilder(hostsNamesProvider);
    }

    private static class CidBuilder extends Builder {
        private MediaHelper.ResponsiveMediaUrlBuilder.HostsNamesProvider hostsNamesProvider;

        private CidBuilder(HostsNamesProvider hostsNamesProvider) {
            this.hostsNamesProvider = hostsNamesProvider;
        }

        @Override
        public String buildInternal() {
            return String.format("%s/cid/scale/%sx%s/%s%s",
                    hostsNamesProvider.getCidHostname(),
                    getWidth(),
                    isZeroAspect() ? "" : getHeight(),
                    hostsNamesProvider.getHostname(),
                    getBaseUrl());
        }
    }
}
