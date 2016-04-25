package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.entities.Values;

import java.io.IOException;

/**
 * List of predefined simple converters used for 51degrees mapping.
 */
public interface Converters {

    /**
     * Tries to get an Integer value.
     */
    Converter<Integer> TO_INTEGER = new Converter<Integer>() {
        @Override
        Integer convert(Values value) throws IOException {
            return Double.valueOf(value.toDouble()).intValue();
        }
    };

    /**
     * Tries to get a Boolean value.
     */
    Converter<Boolean> TO_BOOLEAN = new Converter<Boolean>() {
        @Override
        Boolean convert(Values value) throws IOException {
            return value.toBool();
        }
    };

    /**
     * Tries to get a String value.
     */
    Converter<String> TO_STRING = new Converter<String>() {
        @Override
        String convert(Values value) throws IOException {
            return value.toString();
        }
    };
}
