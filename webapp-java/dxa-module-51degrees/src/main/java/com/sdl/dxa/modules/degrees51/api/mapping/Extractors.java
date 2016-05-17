package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.StringTokenizer;

import static com.google.common.collect.Sets.newHashSet;
import static com.sdl.dxa.modules.degrees51.api.mapping.Converters.TO_BOOLEAN;
import static com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Mapping.dummyMapping;
import static com.sdl.webapp.common.util.ApplicationContextHolder.getContext;

/**
 * List of predefined extractors used for 51degrees mapping.
 */
@Slf4j
public final class Extractors {

    public static final Extractor<Double> FROM_CONTEXT_COOKIE_DOUBLE = new FromContextCookie<Double>() {
        @Override
        protected Double extract(Match match, Degrees51Mapping mapping) {
            String value = findInContextCookie(mapping.getKey());
            return value != null ? Double.parseDouble(value) : null;
        }
    };

    public static final Extractor<Integer> FROM_CONTEXT_COOKIE_INTEGER = new FromContextCookie<Integer>() {
        @Override
        protected Integer extract(Match match, Degrees51Mapping mapping) {
            String value = findInContextCookie(mapping.getKey());
            return value != null ? Integer.parseInt(value) : null;
        }
    };

    /**
     * <p>Concatenates String representations of the given DXA claims properties given in a mapping.
     * Uses a given symbol to delimit parts.</p>
     * <p>Properties are expected to be '+'-separated. Uses properties' mapping to resolve their conditionalValues properly.</p>
     * <p>E.g. <code>os.model + ' ' + browser.name + '_' + browser.type + browser.version</code>
     * will resolve and concatenate these properties using given delimiters: Windows Chrome_Desktop49</p>
     */
    public static final Extractor<String> CONCAT_GIVEN = new Extractor<String>() {
        @Override
        protected String extract(Match match, Degrees51Mapping mapping) {
            StringBuilder sb = new StringBuilder();
            StringTokenizer tokenizer = new StringTokenizer(mapping.getKey(), "+");
            while (tokenizer.hasMoreTokens()) {
                String token = tokenizer.nextToken().trim();

                if (token.startsWith("\'") && token.endsWith("\'")) {
                    sb.append(token.substring(1, token.length() - 1));
                    continue;
                }

                Degrees51Mapping degrees51Mapping = Degrees51Mapping.retrieveMappingByDxaKey(token);
                if (degrees51Mapping == null) {
                    log.warn("Incorrect mapping found for {}, couldn't resolve mapping for {}", mapping, token);
                    continue;
                }

                sb.append(degrees51Mapping.process(match));
            }
            return sb.toString();
        }
    };

    private Extractors() {
    }

    public static Extractor<Boolean> isStringEqualTo(final String value) {
        return new Extractor<Boolean>() {
            @Override
            protected Boolean extract(Match match, Degrees51Mapping mapping) {
                return value != null && value.equalsIgnoreCase(Converters.TO_STRING.process(match, mapping));
            }
        };
    }

    public static Extractor<Set<String>> ifKeyThenSetOf(final Set<String> alwaysIn, final String... conditionalValues) {
        return new Extractor<Set<String>>() {
            @Override
            protected Set<String> extract(Match match, Degrees51Mapping mapping) {
                String key = mapping.getKey();

                boolean condition = false;
                StringTokenizer tokenizer = new StringTokenizer(key, "|");
                while (tokenizer.hasMoreTokens()) {
                    Boolean res = dummyMapping(tokenizer.nextToken().trim(), TO_BOOLEAN).process(match);
                    condition = res != null && res;
                    if (condition) {
                        break;
                    }
                }

                Set<String> result = newHashSet(alwaysIn);
                if (condition) {
                    result.addAll(Arrays.asList(conditionalValues));
                }
                return result;
            }
        };
    }

    public static Extractor<Set<String>> ifKeyThenSetOf(final String... conditionalValues) {
        return ifKeyThenSetOf(Collections.<String>emptySet(), conditionalValues);
    }

    public static <T> Extractor<T> justReturn(final T value) {
        return new Extractor<T>() {
            @Override
            protected T extract(Match match, Degrees51Mapping mapping) {
                return value;
            }
        };
    }

    private abstract static class FromContextCookie<T> extends Extractor<T> {

        private String getContextCookie() {
            Cookie[] cookies = getContext().getBean(Helper.class).getCookies();
            if (cookies != null) {

                for (Cookie cookie : cookies) {
                    if (Objects.equals("context", cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }

            return null;
        }

        String findInContextCookie(String key) {
            String contextCookie = getContextCookie();
            if (contextCookie == null) {
                return null;
            }

            String findStr = "|" + key + "~";
            String sub = contextCookie.substring(contextCookie.indexOf(findStr) + findStr.length());
            return sub.substring(0, sub.indexOf("|"));
        }
    }

    /**
     * The only reason why this exists is to ease stubbing {@link HttpServletRequest} for tests without using weird
     * static stubbing or complicated configurations for tests for Web Requests scope,
     * and still have {@link HttpServletRequest} available in runtime.
     */
    @Component
    public static class Helper {

        @Autowired
        private HttpServletRequest httpServletRequest;

        Cookie[] getCookies() {
            return httpServletRequest.getCookies();
        }
    }
}
