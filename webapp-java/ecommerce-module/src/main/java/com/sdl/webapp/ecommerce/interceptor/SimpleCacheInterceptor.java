package com.sdl.webapp.ecommerce.interceptor;

import com.sdl.webapp.ecommerce.model.ECommerceEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * SimpleCacheInterceptor
 *
 * @author nic
 */
public class SimpleCacheInterceptor implements ECommerceEntityInterceptor {

    private long cacheTime;
    private Map<String, CacheItem> cachedItems = new HashMap<>();

    class CacheItem {
        ECommerceEntity item;
        long cacheTimestamp;

        CacheItem(ECommerceEntity item) {
            this.item = item;
            this.cacheTimestamp = System.currentTimeMillis();
        }

        boolean isExpired() {
            return this.cacheTimestamp + cacheTime < System.currentTimeMillis();
        }
    }

    public SimpleCacheInterceptor(long cacheTime) {
        this.cacheTime = cacheTime;
    }

    @Override
    public ECommerceEntity preprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass) {
        return this.getCacheItem(entityClass, id);
    }

    @Override
    public ECommerceEntity postprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass) {
        String cacheKey = entityClass.getSimpleName() + ":" + entity.getId();
        this.cachedItems.put(cacheKey, new CacheItem(entity));
        return entity;
    }

    private ECommerceEntity getCacheItem(Class<?> type, String cacheKey) {
        CacheItem cacheItem = this.cachedItems.get(type.getSimpleName() + ":" + cacheKey);
        if ( cacheItem != null && !cacheItem.isExpired() ) {
            return cacheItem.item;
        }
        else {
            return null;
        }
    }

}
