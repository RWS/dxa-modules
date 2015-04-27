package com.sdl.webapp.ecommerce.interceptor;

import com.sdl.webapp.ecommerce.LinkResolver;
import com.sdl.webapp.ecommerce.LinkResolverAware;
import com.sdl.webapp.ecommerce.model.ECommerceEntity;

/**
 * LinkResolverAwareInterceptor
 *
 * @author nic
 */
public class LinkResolverAwareInterceptor implements ECommerceEntityInterceptor {

    private LinkResolver linkResolver;

    public LinkResolverAwareInterceptor(LinkResolver linkResolver) {
        this.linkResolver = linkResolver;
    }

    @Override
    public ECommerceEntity preprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass) {
        return null;
    }

    @Override
    public ECommerceEntity postprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass) {
        if ( entity instanceof LinkResolverAware) {
            ((LinkResolverAware) entity).setLinkResolver(this.linkResolver);
        }
        return entity;
    }
}
