package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.entities.Values;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Objects;

/**
 * Converter is a type of {@link Degrees51Processor} that simply converts an existing value to the requested type.
 *
 * @param <T> type to convert value to
 */
@Slf4j
public abstract class Converter<T> extends Degrees51Processor<T> {

    abstract T convert(Values values) throws IOException;

    @Override
    T processInternal(Match match, Degrees51Mapping mapping) throws IOException {
        T converted;

        Values values = match.getValues(mapping.getKey());

        String strValue;
        if (values == null || (strValue = values.toString()) == null || isUnknownValue(strValue)) {
            log.warn("Value {} is unknown, returning null", mapping.getKey());
            return null;
        }

        converted = convert(values);
        log.debug("Converted '{}' to '{}' as '{}'", strValue, converted, converted.getClass());

        return converted;
    }

    private boolean isUnknownValue(String strValue) {
        return Objects.equals("Unknown", strValue);
    }
}
