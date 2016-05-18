package com.sdl.dxa.modules.degrees51.contextengine;

import com.sdl.dxa.modules.degrees51.api.Degrees51DataProvider;
import com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Mapping;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.exceptions.DxaException;
import fiftyone.mobile.detection.Match;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@Profile("51degrees.context.provider")
@Primary
public class Degrees51ClaimsProvider implements ContextClaimsProvider {

    @Autowired
    private Degrees51DataProvider degrees51DataProvider;

    @Autowired
    @SuppressWarnings({"SpringJavaAutowiringInspection", "MismatchedQueryAndUpdateOfCollection"})
    private List<Degrees51Mapping> mappings;

    @Autowired
    private HttpServletRequest request;

    @Override
    public Map<String, Object> getContextClaims(String aspectName) throws DxaException {
        log.trace("51degrees.context.provider activated");

        String userAgent = request.getHeader("user-agent");
        log.trace("UserAgent is {}", userAgent);

        Match match = degrees51DataProvider.match(userAgent);
        return match != null ? map(match) : Collections.<String, Object>emptyMap();
    }

    @Override
    public String getDeviceFamily() {
        return null;
    }

    Map<String, Object> map(Match match) {
        Map<String, Object> result = new HashMap<>();
        for (Degrees51Mapping mapping : mappings) {
            result.put(mapping.getKeyDxa(), mapping.process(match));
        }

        return result;
    }

}
