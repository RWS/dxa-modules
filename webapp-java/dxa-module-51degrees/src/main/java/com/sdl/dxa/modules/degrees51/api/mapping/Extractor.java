package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;

import java.io.IOException;

/**
 * Extractor is a type of {@link Degrees51Processor} that can be used to build complex values out of existing match,
 * and return the value of the requested type.
 *
 * @param <T> type of the expected value
 */
public abstract class Extractor<T> extends Degrees51Processor<T> {

    abstract T extract(Match match, Degrees51Mapping mapping);

    @Override
    T processInternal(Match match, Degrees51Mapping mapping) throws IOException {
        return extract(match, mapping);
    }
}
