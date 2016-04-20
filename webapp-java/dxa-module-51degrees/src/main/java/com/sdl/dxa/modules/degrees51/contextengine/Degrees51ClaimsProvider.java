package com.sdl.dxa.modules.degrees51.contextengine;

import com.sdl.dxa.modules.degrees51.device.Degrees51DataProvider;
import com.sdl.dxa.modules.degrees51.mapping.Degrees51Mapper;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.exceptions.DxaException;
import fiftyone.mobile.detection.Match;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.core.util.HttpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@Profile("51degrees.context.provider")
@Primary
public class Degrees51ClaimsProvider implements ContextClaimsProvider {

    @Autowired
    private Degrees51DataProvider degrees51DataProvider;

    @Autowired
    private Degrees51Mapper degrees51Mapper;

    @Override
    public Map<String, Object> getContextClaims(String aspectName) throws DxaException {
        log.trace("51degrees.context.provider activated");

        String userAgent = HttpUtils.getCurrentRequest().getHeader("user-agent");
        log.trace("UserAgent is {}", userAgent);
        Match match = degrees51DataProvider.match(userAgent);

        return degrees51Mapper.map(match);
    }

    @Override
    public String getDeviceFamily() {
        return null;
    }
}
