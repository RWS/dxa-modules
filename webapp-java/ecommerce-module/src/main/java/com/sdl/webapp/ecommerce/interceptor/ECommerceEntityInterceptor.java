package com.sdl.webapp.ecommerce.interceptor;

import com.sdl.webapp.ecommerce.model.ECommerceEntity;

/**
 * ECommerce Entity Interceptor
 *
 * @author nic
 */
public interface ECommerceEntityInterceptor {

    ECommerceEntity preprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass);

    ECommerceEntity postprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass);
}
