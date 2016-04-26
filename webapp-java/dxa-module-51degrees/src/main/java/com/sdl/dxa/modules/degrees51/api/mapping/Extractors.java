package com.sdl.dxa.modules.degrees51.api.mapping;

import com.sdl.webapp.common.util.ApplicationContextHolder;
import fiftyone.mobile.detection.Match;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * List of predefined extractors used for 51degrees mapping.
 */
public interface Extractors {

    Extractor<Integer> FROM_CONTEXT_COOKIE = new Extractor<Integer>() {

        @Override
        Integer extract(Match match, Degrees51Mapping mapping) {
            String contextCookie = getContextCookie();

            return contextCookie == null ? null : Integer.parseInt(findInContextCookie(contextCookie, mapping.getKey()));
        }

        private String getContextCookie() {
            Cookie[] cookies = ApplicationContextHolder.getContext().getBean(Helper.class).getCookies();
            if (cookies != null) {

                for (Cookie cookie : cookies) {
                    if (Objects.equals("context", cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }

            return null;
        }

        private String findInContextCookie(String contextCookie, String key) {
            String findStr = "|" + key + "~";
            String sub = contextCookie.substring(contextCookie.indexOf(findStr) + findStr.length());
            return sub.substring(0, sub.indexOf("|"));
        }
    };

    /**
     * The only reason why this exists is to ease stubbing {@link HttpServletRequest} for tests without using weird
     * static stubbing or complicated configurations for tests for Web Requests scope,
     * and still have {@link HttpServletRequest} available in runtime.
     */
    @Component
    class Helper {

        @Autowired
        private HttpServletRequest httpServletRequest;

        Cookie[] getCookies() {
            return httpServletRequest.getCookies();
        }
    }
}
