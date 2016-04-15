package com.sdl.dxa.modules.degrees51.mapping;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class Degrees51Mapper {

    public Map<String, Object> map(Map<String, List<String>> values) {

        Map<String, Object> result = new HashMap<>();

        for (Map.Entry<String, List<String>> entry : values.entrySet()) {
            String key = entry.getKey();

            if (Degrees51Mapping.isKnownKey(key)) {
                Degrees51Mapping mapping = Degrees51Mapping.getByKey(key);

                result.put(mapping.getKeyDxa(), mapping.convert(entry.getValue()));
            }
        }

        return result;
    }
}
