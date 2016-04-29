package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**
 * Extractor is a type of {@link Degrees51Processor} that can be used to build complex values out of existing match,
 * and return the value of the requested type.
 *
 * @param <T> type of the expected value
 */
@Slf4j
public abstract class Extractor<T> extends Degrees51Processor<T> {

    protected abstract T extract(Match match, Degrees51Mapping mapping);

    @Override
    protected T processInternal(Match match, Degrees51Mapping mapping) throws IOException {
        T result = extract(match, mapping);
        log.debug("Extracted value '{}' as class {} using mapping {}", result, result.getClass(), mapping);
        return result;
    }
}
