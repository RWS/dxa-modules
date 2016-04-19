package com.sdl.dxa.modules.degrees51.contextengine;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.modules.degrees51.cloud.MatchEntity;
import com.sdl.dxa.modules.degrees51.mapping.Degrees51Mapper;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Component
@Profile("51degrees.context.provider")
@Primary
public class Degrees51ClaimsProvider implements ContextClaimsProvider {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Degrees51Mapper degrees51Mapper;

    private boolean disabled;

    @Override
    public Map<String, Object> getContextClaims(String aspectName) throws DxaException {
        log.trace("51degrees.context.provider activated");

        MatchEntity match = match();
        log.trace("Loaded a match entity from 51degrees {}", match);
        match.getValues().put("ScreenPixelsWidth", Collections.singletonList("1024"));
        match.getValues().put("ScreenPixelsHeight", Collections.singletonList("640"));

        return degrees51Mapper.map(match.getValues());
    }

    @Override
    public String getDeviceFamily() {
        return null;
    }


    //    @SneakyThrows(URISyntaxException.class)
    private MatchEntity match() {
        return null;

//        new Provider(StreamFactory.create())
//        URI uri = new URIBuilder(this.endpoints.match())
//                .addParameter("user-agent", HttpUtils.getCurrentRequest().getHeader("user-agent"))
//                .build();
//
//        try {
//            CloseableHttpResponse response = HttpClients.createDefault().execute(new HttpGet(uri));
//
//            return objectMapper.readValue(response.getEntity().getContent(), MatchEntity.class);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        throw new RuntimeException();
    }

}
