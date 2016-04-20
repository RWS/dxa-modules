package com.sdl.dxa.modules.degrees51.mapping;

import fiftyone.mobile.detection.entities.Values;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static com.sdl.dxa.modules.degrees51.mapping.Degrees51Mapping.Converters.TO_BOOLEAN;
import static com.sdl.dxa.modules.degrees51.mapping.Degrees51Mapping.Converters.TO_INTEGER;

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

    @Getter
    private String key51degrees;

    @Getter
    private String keyDxa;

    private Converter<?> converter;

    Degrees51Mapping(String key51degrees, String keyDxa, Converter<?> converter) {
        this.key51degrees = key51degrees;
        this.keyDxa = keyDxa;
        this.converter = converter;
    }


    Degrees51Mapping(String key51degrees, String keyDxa) {
        this.key51degrees = key51degrees;
        this.keyDxa = keyDxa;
    }

    public Object convert(Values values) {
        Object converted;

        String strValue = values.toString();

        if (isUnknownValue(strValue)) {
            log.warn("Value {} is unknown, returning null", key51degrees);
            return null;
        }

        if (converter != null) {
            converted = converter.convert(values);
            log.debug("Converted '{}' to '{}' as '{}'", strValue, converted, converted.getClass());
        } else {
            converted = strValue;
            log.debug("No converter set, so returning as String '{}'", converted);
        }

        return converted;
    }

    private boolean isUnknownValue(String strValue) {
        return Objects.equals("Unknown", strValue);
    }

    private abstract static class Converter<T> {

        abstract T convertInternal(Values value) throws IOException;

        T convert(Values values) {
            try {
                return convertInternal(values);
            } catch (IOException e) {
                log.error("Exception while converting", e);
                return null;
            }
        }
    }

    static class Converters {

        static final Converter<Integer> TO_INTEGER = new Converter<Integer>() {
            @Override
            Integer convertInternal(Values value) throws IOException {
                return Double.valueOf(value.toDouble()).intValue();
            }
        };

        static final Converter<Boolean> TO_BOOLEAN = new Converter<Boolean>() {
            @Override
            Boolean convertInternal(Values value) throws IOException {
                return value.toBool();
            }
        };
    }
}
