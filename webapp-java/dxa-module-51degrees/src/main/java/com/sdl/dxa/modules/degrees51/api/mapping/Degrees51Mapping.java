package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;

import static com.sdl.webapp.common.util.ApplicationContextHolder.getContext;

/**
 * <p>Mapping between a property in DXA and possible property in 51degrees
 * which can be resolved either by direct mapping or by building its value by {@link Degrees51Processor} instance.</p>
 */
public abstract class Degrees51Mapping<T> {

    @SuppressWarnings("unchecked")
    public static <T> Degrees51Mapping<T> retrieveMappingByDxaKey(String dxaKey) {
        try {
            return (Degrees51Mapping<T>) getContext().getBean(dxaKey, Degrees51Mapping.class);
        } catch (NoSuchBeanDefinitionException e) {
            return null;
        }
    }

    public static <T> Degrees51Mapping<T> dummyMapping(final String degrees51Key, final Degrees51Processor<T> processor) {
        return createMapping("dummy", degrees51Key, processor);
    }

    public static <T> Degrees51Mapping<T> createMapping(final String dxaKey, final String degrees51Key, final Degrees51Processor<T> processor) {
        return new Degrees51Mapping<T>() {
            @Override
            public String getKey() {
                return degrees51Key;
            }

            @Override
            public String getKeyDxa() {
                return dxaKey;
            }

            @Override
            public Degrees51Processor<T> getProcessor() {
                return processor;
            }
        };
    }

    public T process(Match match) {
        return getProcessor().process(match, this);
    }

    /**
     * Optional key/property in 51degrees or context. May return <code>null</code>.
     *
     * @return key in 51degrees properties or context key or <code>null</code> if there is no direct mapping
     */
    public abstract String getKey();

    /**
     * DXA mapping for {@link com.sdl.webapp.common.api.contextengine.ContextClaims}. Should never return <code>null</code>.
     *
     * @return DXA key mapping
     */
    public abstract String getKeyDxa();

    /**
     * Processor for a match from 51degrees to get a real value DXA needs. Never should return null.
     *
     * @return processor for a match
     */
    public abstract Degrees51Processor<T> getProcessor();

    @Override
    public String toString() {
        return String.format("Degrees51Mapping: %s <> %s", getKey(), getKeyDxa());
    }
}
