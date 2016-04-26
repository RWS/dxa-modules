package com.sdl.dxa.modules.degrees51.api.mapping;

/**
 * <p>Mapping between a property in DXA and possible property in 51degrees
 * which can be resolved either by direct mapping or by building its value by {@link Degrees51Processor} instance.</p>
 */
public abstract class Degrees51Mapping {

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
     * Processor for a match from 51degrees to get a real value DXA needs.
     *
     * @return processor for a match
     */
    public abstract Degrees51Processor<?> getProcessor();

    @Override
    public String toString() {
        return String.format("Degrees51Mapping: %s <> %s", getKey(), getKeyDxa());
    }
}
