package com.sdl.dxa.modules.degrees51.api.mapping;

import fiftyone.mobile.detection.Match;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;

import static com.sdl.webapp.common.util.ApplicationContextHolder.getContext;

/**
 * <p>Mapping between a property in DXA and possible property in 51degrees
 * which can be resolved either by direct mapping or by building its value by {@link Degrees51Processor} instance.</p>
 */
public abstract class Degrees51Mapping<T> {

    /**
     * Tries to resolve a registered mapping from Spring context by its name.
     * Typically name of this mapping is a DXA claim name.
     *
     * @param dxaKey name of the mapping, typically DXA claim name
     * @param <T>    an expected type of final value for this mapping
     * @return a mapping if found or null
     */
    @SuppressWarnings("unchecked")
    public static <T> Degrees51Mapping<T> retrieveMappingByDxaKey(String dxaKey) {
        try {
            return (Degrees51Mapping<T>) getContext().getBean(dxaKey, Degrees51Mapping.class);
        } catch (NoSuchBeanDefinitionException e) {
            return null;
        }
    }

    /**
     * Creates a dummy temporal mapping for in-process usage.
     *
     * @param degrees51Key a key that will be passed to processor
     * @param processor    processor to get a value
     * @param <T>          type of expected value
     * @return a dummy mapping with a DXA key 'dummy'
     */
    public static <T> Degrees51Mapping<T> dummyMapping(final String degrees51Key, final Degrees51Processor<T> processor) {
        return createMapping("dummy", degrees51Key, processor);
    }

    /**
     * Creates a mapping object.
     *
     * @param dxaKey       DXA claims key
     * @param degrees51Key optional key for 3rd-party property which will be passed to processor in mapping
     * @param processor    processor to convert/extract value using {@link Match} and this mapping
     * @param <T>          type of value returned by processor
     * @return a mapping with all fields set
     */
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

    /**
     * Processes value for current mapping.
     *
     * @param match match object from 51degrees
     * @return a value or null if not found
     */
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
    protected abstract Degrees51Processor<T> getProcessor();

    @Override
    public String toString() {
        return String.format("Degrees51Mapping: %s <> %s", getKey(), getKeyDxa());
    }
}
