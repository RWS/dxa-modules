package com.sdl.dxa.modules.audience.security;

import com.sdl.dxa.modules.audience.service.AudienceManagerService;
import com.sdl.webapp.common.api.WebRequestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

@Service("audienceManagerClaimFilter")
public class AudienceManagerClaimFilter extends GenericFilterBean {

    private final AudienceManagerService audienceManagerService;

    private final WebRequestContext webRequestContext;

    @Value("${dxa.spring.security.am.filter.ignore.path}")
    private String ignoreRegexp;

    @Autowired
    public AudienceManagerClaimFilter(WebRequestContext webRequestContext, AudienceManagerService audienceManagerService) {
        this.webRequestContext = webRequestContext;
        this.audienceManagerService = audienceManagerService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String requestPath = webRequestContext.getRequestPath();
        if (!requestPath.matches(ignoreRegexp)) {
            audienceManagerService.prepareClaims(requestPath);
        }
        chain.doFilter(request, response);
    }

}
