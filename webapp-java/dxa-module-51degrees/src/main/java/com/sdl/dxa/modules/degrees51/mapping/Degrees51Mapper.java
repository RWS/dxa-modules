package com.sdl.dxa.modules.degrees51.mapping;

import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.entities.Values;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class Degrees51Mapper {

    public Map<String, Object> map(Match match) {
        Map<String, Object> result = new HashMap<>();

        for (Degrees51Mapping mapping : Degrees51Mapping.values()) {
            try {
                Values values = match.getValues(mapping.getKey51degrees());

                if (values == null) {
                    log.warn("Expected mapping is not found in MATCH");
                    continue;
                }

                result.put(mapping.getKeyDxa(), mapping.convert(values));

            } catch (IOException e) {
                log.error("Exception while mapping Match with Claims, skipping {} which is {}",
                        mapping.getKey51degrees(), mapping.getKeyDxa(), e);
            }
        }


        return result;
    }
}
