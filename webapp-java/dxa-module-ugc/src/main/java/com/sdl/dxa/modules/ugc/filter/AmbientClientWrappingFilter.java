package com.sdl.dxa.modules.ugc.filter;

import com.sdl.web.ambient.client.AmbientClientFilter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter("/api/comments/*")
public class AmbientClientWrappingFilter implements Filter {
    private AmbientClientFilter delegate = new AmbientClientFilter();
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        delegate.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        delegate.doFilter(request, response, chain);
    }

    @Override
    public void destroy() {
        delegate.destroy();
    }
}
