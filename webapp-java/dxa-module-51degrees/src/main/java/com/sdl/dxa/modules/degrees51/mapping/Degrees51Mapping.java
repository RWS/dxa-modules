package com.sdl.dxa.modules.degrees51.mapping;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.sdl.dxa.modules.degrees51.mapping.Degrees51Mapping.Converters.TO_BOOLEAN;
import static com.sdl.dxa.modules.degrees51.mapping.Degrees51Mapping.Converters.TO_INTEGER;

@Getter
@Slf4j
enum Degrees51Mapping {

    BROWSER_VERSION("BrowserVersion", "browser.version"),
    BROWSER_WIDTH("ScreenPixelsWidth", "browser.displayWidth", TO_INTEGER),
    BROWSER_HEIGHT("ScreenPixelsHeight", "browser.displayHeight", TO_INTEGER),

    DEVICE_IS_MOBILE("IsMobile", "device.mobile", TO_BOOLEAN),

    OS_VERSION("PlatformVersion", "os.version");

    static Map<String, Degrees51Mapping> fromString = new HashMap<>();

    static {
        for (Degrees51Mapping degrees51Mapping : values()) {
            fromString.put(degrees51Mapping.key51degrees, degrees51Mapping);
        }
    }

    private String key51degrees;

    private String keyDxa;

    private Converter<?> converter;

    Degrees51Mapping(String key51degrees, String keyDxa) {
        this.key51degrees = key51degrees;
        this.keyDxa = keyDxa;
    }

    Degrees51Mapping(String key51degrees, String keyDxa, Converter<?> converter) {
        this.key51degrees = key51degrees;
        this.keyDxa = keyDxa;
        this.converter = converter;
    }

    static boolean isKnownKey(String key51degrees) {
        boolean isKnownKey = fromString.containsKey(key51degrees);
        //todo dxa2 do this with aspects
        if (isKnownKey) {
            log.debug("51degrees key '{}' has a known mapping", key51degrees);
        } else {
            log.trace("51degrees key '{}' has no mapping", key51degrees);
        }
        return isKnownKey;
    }

    static Degrees51Mapping getByKey(String key51degrees) {
        Degrees51Mapping mapping = fromString.get(key51degrees);
        log.debug("Mapping 51Degrees key '{}' to ours '{}' with '{}' converter",
                key51degrees, mapping.keyDxa, mapping.converter == null ? null : mapping.converter.getGenericType());
        return mapping;
    }

    public Object convert(List<String> values) {
        Object converted;
        String value = values.get(0);
        if (converter != null) {
            converted = converter.convert(value);
            log.debug("Converted '{}' from 'String' to '{}' as '{}'", value, converted, converted.getClass());
        } else {
            converted = value;
            log.debug("No converter set, so returning as is '{}'", converted);
        }

        return converted;
    }

    private abstract static class Converter<T> {

        private final Class<T> type;

        Converter(Class<T> type) {
            this.type = type;
        }

        abstract T convert(String value);

        Class<T> getGenericType() {
            return type;
        }
    }

    static class Converters {

        static final Converter<Integer> TO_INTEGER = new Converter<Integer>(Integer.class) {
            @Override
            public Integer convert(String value) {
                return Integer.parseInt(value);
            }
        };

        static final Converter<Boolean> TO_BOOLEAN = new Converter<Boolean>(Boolean.class) {
            @Override
            Boolean convert(String value) {
                return Boolean.parseBoolean(value);
            }
        };
    }
}
