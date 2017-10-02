package com.sdl.dxa.modules.model.TSI2525;

import javax.cache.event.CacheEntryEvent;
import javax.cache.event.CacheEntryEventFilter;
import javax.cache.event.CacheEntryListenerException;
import javax.cache.event.EventType;
import java.io.Serializable;

public class OnlyCreatedFilter<K, V> implements CacheEntryEventFilter<K, V>, Serializable {

    private static final long serialVersionUID = 1L;

    @Override
    public boolean evaluate(CacheEntryEvent<? extends K, ? extends V> event) throws CacheEntryListenerException {
        return event.getEventType() == EventType.CREATED;
    }
}
