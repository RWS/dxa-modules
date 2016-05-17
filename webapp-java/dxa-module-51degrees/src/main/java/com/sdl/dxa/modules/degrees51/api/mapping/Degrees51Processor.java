package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**
 * Instances of this class process {@link Match} to resolve needed value for {@link Degrees51Mapping}.
 *
 * @param <T> class of value to resolve
 */
@Slf4j
public abstract class Degrees51Processor<T> {

    protected abstract T processInternal(Match match, Degrees51Mapping mapping) throws IOException;

    public T process(Match match, Degrees51Mapping mapping) {
        try {
            return processInternal(match, mapping);
        } catch (IOException e) {
            log.error("Exception while processing", e);
            return null;
        }
    }
}
